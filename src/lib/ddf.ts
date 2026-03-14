/**
 * REALTOR.ca DDF® Web API client
 * OData v4, Bearer Token auth, RESO Property resource
 * Docs: https://ddfapi-docs.realtor.ca/
 */

import { Listing } from "@/lib/types";

const DDF_BASE = process.env.DDF_API_BASE_URL ?? "https://ddfapi.realtor.ca";
const DDF_TOKEN_URL = process.env.DDF_TOKEN_URL ?? "https://auth.realtor.ca/oauth2/v1/token";
const DDF_CLIENT_ID = process.env.DDF_CLIENT_ID ?? "";
const DDF_CLIENT_SECRET = process.env.DDF_CLIENT_SECRET ?? "";

const DDF_ID_PREFIX = "ddf-";

export function isDdfListingId(id: string): boolean {
  return id.startsWith(DDF_ID_PREFIX);
}

export function toDdfId(propertyKey: string): string {
  return `${DDF_ID_PREFIX}${propertyKey}`;
}

export function fromDdfId(id: string): string | null {
  if (!id.startsWith(DDF_ID_PREFIX)) return null;
  return id.slice(DDF_ID_PREFIX.length);
}

// ─── Token cache ───────────────────────────────────────────────────────────
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  if (!DDF_CLIENT_ID || !DDF_CLIENT_SECRET) {
    throw new DdfError("DDF_CLIENT_ID and DDF_CLIENT_SECRET must be set in env", "CONFIG");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: DDF_CLIENT_ID,
    client_secret: DDF_CLIENT_SECRET,
  }).toString();

  const res = await fetch(DDF_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new DdfError(`Token fetch failed: ${res.status} ${text}`, "AUTH");
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  const expiresIn = (data.expires_in ?? 3600) * 1000;
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + expiresIn,
  };
  return data.access_token;
}

// ─── HTTP with retries ─────────────────────────────────────────────────────
class DdfError extends Error {
  constructor(
    message: string,
    public code: "AUTH" | "RATE_LIMIT" | "CONFIG" | "NOT_FOUND" | "UNKNOWN"
  ) {
    super(message);
    this.name = "DdfError";
  }
}

async function ddfFetch<T>(url: string, token: string): Promise<{ data: T; status: number }> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401) {
    tokenCache = null;
    throw new DdfError("Token expired or invalid", "AUTH");
  }

  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After");
    throw new DdfError(
      `Rate limited${retryAfter ? `. Retry after ${retryAfter}s` : ""}`,
      "RATE_LIMIT"
    );
  }

  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new DdfError(`Invalid JSON: ${text.slice(0, 200)}`, "UNKNOWN");
  }

  return { data, status: res.status };
}

// ─── RESO → Listing mapper ─────────────────────────────────────────────────
interface DdfProperty {
  ListingKey?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  UnparsedAddress?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  ListAgentFullName?: string;
  PublicRemarks?: string;
  PropertyType?: string;
  PropertySubType?: string;
  LivingArea?: number;
  LotSizeSquareFeet?: number;
  YearBuilt?: number;
  GarageSpaces?: number;
  Media?: Array<{ MediaURL?: string; Order?: number }>;
  Latitude?: number;
  Longitude?: number;
  ListingContractDate?: string;
  ModificationTimestamp?: string;
  StandardStatus?: string;
  [key: string]: unknown;
}

function mapDdfToListing(raw: DdfProperty): Listing {
  const media = (raw.Media ?? [])
    .filter((m) => m.MediaURL)
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0));
  const images = media.map((m) => m.MediaURL!).filter(Boolean);

  return {
    _id: toDdfId(raw.ListingKey ?? ""),
    MLS: raw.ListingKey ?? "",
    ListingType: raw.StandardStatus?.toLowerCase().includes("lease") ? "Lease" : "Sale",
    SearchType: "residential",
    Address: raw.UnparsedAddress ?? "",
    City: raw.City ?? "",
    Province: raw.StateOrProvince === "Ontario" ? "ON" : (raw.StateOrProvince ?? "ON"),
    PostalCode: raw.PostalCode ?? "",
    Price: raw.ListPrice ?? 0,
    Bedrooms: raw.BedroomsTotal ?? 0,
    Bathrooms: raw.BathroomsTotalInteger ?? 0,
    Parking: raw.GarageSpaces ?? 0,
    Area: raw.LivingArea ?? 0,
    LotFrontage: "",
    LotDepth: raw.LotSizeSquareFeet ? String(raw.LotSizeSquareFeet) : "",
    PropertyType: raw.PropertyType ?? raw.PropertySubType ?? "",
    Style: raw.PropertySubType ?? "",
    YearBuilt: raw.YearBuilt ? String(raw.YearBuilt) : "",
    Description: raw.PublicRemarks ?? "",
    Images: images,
    MainImage: images[0] ?? "",
    Latitude: raw.Latitude ?? 0,
    Longitude: raw.Longitude ?? 0,
    DaysOnMarket: 0, // OData may expose DaysOnMarket; add if available
    ListDate: raw.ListingContractDate ?? "",
    UpdatedDate: raw.ModificationTimestamp ?? "",
  };
}

// ─── Search by Address or MLS Number ───────────────────────────────────────
export interface DdfSearchParams {
  query: string; // Address or MLS® Number
  page?: number;
  limit?: number;
}

export interface DdfSearchResult {
  listings: Listing[];
  total: number;
  page: number;
  pages: number;
}

export async function searchProperties(params: DdfSearchParams): Promise<DdfSearchResult> {
  const { query, page = 1, limit = 18 } = params;
  const trimmed = query.trim();
  if (!trimmed) {
    return { listings: [], total: 0, page: 1, pages: 0 };
  }

  const token = await getAccessToken();

  // OData $filter: contains(UnparsedAddress,'...') or ListingKey eq '...'
  // Escape single quotes in OData: double them
  const escaped = trimmed.replace(/'/g, "''");
  const isMls = /^[a-zA-Z0-9]{5,15}$/.test(trimmed); // MLS-like: alphanumeric, 5–15 chars
  const filter = isMls
    ? `ListingKey eq '${escaped}' or contains(UnparsedAddress,'${escaped}')`
    : `contains(UnparsedAddress,'${escaped}')`;

  const top = limit;
  const skip = (page - 1) * limit;
  const paramsStr = new URLSearchParams({
    $filter: filter,
    $top: String(top),
    $skip: String(skip),
    $count: "true",
    $orderby: "ModificationTimestamp desc",
  }).toString();

  const url = `${DDF_BASE}/odata/v1/Property?${paramsStr}`;
  const { data, status } = await ddfFetch<{
    value?: DdfProperty[];
    "@odata.count"?: number;
  }>(url, token);

  if (status === 404) {
    return { listings: [], total: 0, page: 1, pages: 0 };
  }

  const items = data.value ?? [];
  const total = typeof data["@odata.count"] === "number" ? data["@odata.count"] : items.length;
  const listings = items.map(mapDdfToListing);

  return {
    listings,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  };
}

// ─── Fetch full property by PropertyKey/ListingKey ─────────────────────────
export async function getPropertyByKey(propertyKey: string): Promise<Listing | null> {
  const token = await getAccessToken();

  const filter = `ListingKey eq '${propertyKey.replace(/'/g, "''")}'`;
  const url = `${DDF_BASE}/odata/v1/Property?$filter=${encodeURIComponent(filter)}&$top=1`;

  const { data, status } = await ddfFetch<{ value?: DdfProperty[] }>(url, token);

  if (status === 404 || !data.value?.length) {
    return null;
  }

  return mapDdfToListing(data.value[0]);
}

export { DdfError };
