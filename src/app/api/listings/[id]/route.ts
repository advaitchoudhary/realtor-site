import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { Listing } from "@/lib/types";
import { getPropertyByKey, fromDdfId, DdfError } from "@/lib/ddf";

const INCOM_API = process.env.NEXT_PUBLIC_INCOM_API_URL ?? "https://api.ca.incomrealestate.com";
const BROKER_DOMAIN = process.env.INCOM_BROKER_DOMAIN ?? "https://www.priderealty.ca";

// ── HTTP helper ───────────────────────────────────────────────────────────────
function httpsRequest(
  url: string,
  method: string,
  body?: string,
  headers?: Record<string, string>
): Promise<{ body: unknown; status: number }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };
    if (body) reqHeaders["Content-Length"] = Buffer.byteLength(body).toString();

    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method,
        headers: reqHeaders,
        rejectUnauthorized: false,
      },
      (res) => {
        let raw = "";
        res.on("data", (c: Buffer) => { raw += c; });
        res.on("end", () => {
          try {
            resolve({ body: JSON.parse(raw), status: res.statusCode ?? 0 });
          } catch {
            reject(new Error(`Bad JSON from ${url}`));
          }
        });
      }
    );
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
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // DDF listings: id is "ddf-{ListingKey}"
    const ddfKey = fromDdfId(id);
    if (ddfKey) {
      const listing = await getPropertyByKey(ddfKey);
      if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      return NextResponse.json(listing);
    }

    // INCOM listings
    const token = await getToken();
    const { body, status } = await httpsRequest(
      `${INCOM_API}/properties/${id}`,
      "GET",
      undefined,
      { "Access-Token": token }
    );

    const raw = body as Record<string, unknown>;
    if (status >= 400 || raw.message) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(mapListing(raw));
  } catch (err) {
    if (err instanceof DdfError) {
      if (err.code === "AUTH") return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
      if (err.code === "RATE_LIMIT") return NextResponse.json({ error: "Rate limited" }, { status: 429 });
      if (err.code === "CONFIG") return NextResponse.json({ error: "DDF not configured" }, { status: 503 });
    }
    console.error("Listing fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}
