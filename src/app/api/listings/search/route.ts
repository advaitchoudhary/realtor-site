import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { Listing } from "@/lib/types";

const INCOM_API = process.env.NEXT_PUBLIC_INCOM_API_URL ?? "https://api.ca.incomrealestate.com";
const BROKER_DOMAIN = process.env.INCOM_BROKER_DOMAIN ?? "https://www.priderealty.ca";

// ── Search result cache (60-second TTL, in-process) ───────────────────────────
const CACHE_TTL = 60_000; // 1 minute
interface CacheEntry { data: unknown; expires: number; }
const searchCache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = searchCache.get(key);
  if (!entry || entry.expires < Date.now()) { searchCache.delete(key); return null; }
  return entry.data;
}
function setCache(key: string, data: unknown) {
  // Keep cache bounded to 50 queries
  if (searchCache.size >= 50) searchCache.delete(searchCache.keys().next().value!);
  searchCache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// ── HTTP helper (bypasses cert issues for server-side proxy use) ──────────────
interface HttpsResult {
  body: unknown;
  headers: Record<string, string>;
  status: number;
}

function httpsRequest(
  url: string,
  method: string,
  body?: string,
  headers?: Record<string, string>
): Promise<HttpsResult> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };
    if (body) reqHeaders["Content-Length"] = Buffer.byteLength(body).toString();

    const opts: https.RequestOptions = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method,
      headers: reqHeaders,
      rejectUnauthorized: false, // server-side proxy — cert issues don't matter
    };

    const req = https.request(opts, (res) => {
      let raw = "";
      res.on("data", (c: Buffer) => { raw += c; });
      res.on("end", () => {
        try {
          resolve({
            body: JSON.parse(raw),
            headers: res.headers as Record<string, string>,
            status: res.statusCode ?? 0,
          });
        } catch {
          reject(new Error(`Bad JSON from ${url}: ${raw.slice(0, 200)}`));
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── Token cache ───────────────────────────────────────────────────────────────
let tokenCache: { token: string; expireAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expireAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  const { body } = await httpsRequest(
    `${BROKER_DOMAIN}/mapsearchapp/getaccesstoken`,
    "POST",
    undefined,
    { "User-Agent": "Mozilla/5.0", Referer: `${BROKER_DOMAIN}/` }
  );
  const data = body as Record<string, unknown>;
  tokenCache = { token: data.accessToken as string, expireAt: data.expireAt as number };
  return data.accessToken as string;
}

// ── Query builder ─────────────────────────────────────────────────────────────
function buildSort(sortby: string): Record<string, number> {
  if (sortby === "price_asc") return { Price: 1 };
  if (sortby === "price_desc") return { Price: -1 };
  if (sortby === "beds_desc") return { "Details.Bedrooms": -1 };
  return { listedOn: -1 };
}

function buildQuery(search: Record<string, unknown>): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  const searchByText = search.searchByText as string;
  if (searchByText) {
    const city = searchByText.split(",")[0].trim();
    if (city) query.City = { $regex: `^${city}$`, $options: "i" };
  }

  const listingType = search.listingType as string[];
  if (listingType?.length === 1) {
    query.listingType = listingType[0];
  } else if (listingType && listingType.length > 1) {
    query.listingType = { $in: listingType };
  }

  query.searchType = (search.searchType as string) || "residential";

  const bed = search.bed as number;
  if (bed > 0) query["Details.Bedrooms"] = { $gte: bed };

  const bath = search.bath as number;
  if (bath > 0) query["Details.Bathrooms"] = { $gte: bath };

  const priceRange = search.priceRange as { min: number; max: number } | undefined;
  if (priceRange && (priceRange.min > 0 || priceRange.max > 0)) {
    const p: Record<string, number> = {};
    if (priceRange.min > 0) p.$gte = priceRange.min;
    if (priceRange.max > 0) p.$lte = priceRange.max;
    query.Price = p;
  }

  const propertyType = search.propertyType as string;
  if (propertyType) {
    const typeMap: Record<string, string> = {
      detached: "Detached",
      semidetached: "Semi-Detached",
      condo: "Condo Apartment",
      townhomes: "Att/Row/Twnhouse",
    };
    const mapped = typeMap[propertyType] ?? propertyType;
    query.PropertyType = { $regex: mapped, $options: "i" };
  }

  return query;
}

// ── Response mapper ───────────────────────────────────────────────────────────
function mapListing(raw: Record<string, unknown>): Listing {
  const now = Date.now() / 1000;
  const listedOn = raw.listedOn as number;
  const details = (raw.Details ?? {}) as Record<string, unknown>;
  const images = (raw.images ?? []) as string[];

  return {
    _id: raw.id as string,
    MLS: (raw.ListingID as string) ?? "",
    ListingType: (raw.listingType as "Sale" | "Lease") ?? "Sale",
    SearchType: (raw.searchType as "residential" | "commercial") ?? "residential",
    Address: (raw.Address as string) ?? "",
    City: (raw.City as string) ?? "",
    Province: (raw.Province as string) === "Ontario" ? "ON" : ((raw.Province as string) ?? "ON"),
    PostalCode: (raw.PostalCode as string) ?? "",
    Price: (raw.Price as number) ?? 0,
    Bedrooms: (details.Bedrooms as number) ?? 0,
    Bathrooms: (details.Bathrooms as number) ?? 0,
    Parking: (details.ParkingPlaces as number) ?? 0,
    Area: (raw.LotSquareFootage as number) ?? 0,
    LotFrontage: details.FrontFootage ? String(details.FrontFootage) : "",
    LotDepth: "",
    PropertyType: (raw.PropertyType as string) ?? "",
    Style: (raw.PropertyStyle as string) ?? "",
    YearBuilt: details.YearBuilt ? String(details.YearBuilt) : "",
    Description: (raw.MarketingRemarks as string) ?? "",
    Images: images,
    MainImage: images[0] ?? "",
    Latitude: (raw.Latitude as number) ?? 0,
    Longitude: (raw.Longitude as number) ?? 0,
    DaysOnMarket: listedOn ? Math.floor((now - listedOn) / 86400) : 0,
    ListDate: listedOn ? new Date(listedOn * 1000).toISOString() : "",
    UpdatedDate: raw.changed ? new Date(raw.changed as number).toISOString() : "",
    OpenHouse: ((raw.OpenHouse as unknown[]) ?? []).map((oh) => {
      const h = oh as Record<string, unknown>;
      return {
        Date: h.timestamp ? new Date((h.timestamp as number) * 1000).toISOString().split("T")[0] : "",
        From: (h.from as string) ?? "",
        To: (h.to as string) ?? "",
      };
    }),
    VirtualTour: (raw.virtualUrl as string) || undefined,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const search = (body.search ?? {}) as Record<string, unknown>;
    const page = (search.page as number) ?? 1;
    const limit = (search.limit as number) ?? 18;
    const skip = (page - 1) * limit;

    const token = await getToken();
    const query = buildQuery(search);
    const sort = buildSort(search.sortby as string);

    // Check cache first — key is the full query+pagination fingerprint
    const cacheKey = JSON.stringify({ query, sort, limit, skip });
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const { body: rawBody, headers, status } = await httpsRequest(
      `${INCOM_API}/properties`,
      "SEARCH",
      JSON.stringify({ query, sort, limit, skip, soldData: false }),
      { "Access-Token": token }
    );

    if (status < 200 || status >= 300) {
      console.error("Incom API error:", status, rawBody);
      return NextResponse.json({ listings: [], total: 0, page, pages: 0 }, { status: 502 });
    }

    const total = parseInt((headers["x-total-count"] as string) ?? "0", 10);
    const listings = (rawBody as Record<string, unknown>[]).map(mapListing);
    const result = { listings, total, page, pages: Math.ceil(total / limit) };

    setCache(cacheKey, result);
    return NextResponse.json(result, { headers: { "X-Cache": "MISS" } });
  } catch (err) {
    console.error("Search route error:", err);
    return NextResponse.json({ listings: [], total: 0, page: 1, pages: 0 }, { status: 500 });
  }
}
