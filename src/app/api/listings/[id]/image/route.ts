import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { getPropertyByKey, fromDdfId } from "@/lib/ddf";

const INCOM_API = process.env.NEXT_PUBLIC_INCOM_API_URL ?? "https://api.ca.incomrealestate.com";
const BROKER_DOMAIN = process.env.INCOM_BROKER_DOMAIN ?? "https://www.priderealty.ca";

let tokenCache: { token: string; expireAt: number } | null = null;

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
      { hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method, headers: reqHeaders, rejectUnauthorized: false },
      (res) => {
        let raw = "";
        res.on("data", (c: Buffer) => { raw += c; });
        res.on("end", () => {
          try { resolve({ body: JSON.parse(raw), status: res.statusCode ?? 0 }); }
          catch { reject(new Error("Bad JSON")); }
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expireAt > Date.now() + 60_000) return tokenCache.token;
  const { body } = await httpsRequest(
    `${BROKER_DOMAIN}/mapsearchapp/getaccesstoken`, "POST", undefined,
    { "User-Agent": "Mozilla/5.0", Referer: `${BROKER_DOMAIN}/` }
  );
  const d = body as Record<string, unknown>;
  tokenCache = { token: d.accessToken as string, expireAt: d.expireAt as number };
  return d.accessToken as string;
}

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
      if (!listing) return NextResponse.json({ image: null, total: 0 }, { status: 404 });
      const images = listing.Images?.length ? listing.Images : (listing.MainImage ? [listing.MainImage] : []);
      return NextResponse.json(
        { image: listing.MainImage ?? images[0] ?? null, total: images.length },
        { headers: { "Cache-Control": "public, max-age=600" } }
      );
    }

    // INCOM listings
    const token = await getToken();
    const { body, status } = await httpsRequest(
      `${INCOM_API}/properties/${id}`, "GET", undefined, { "Access-Token": token }
    );
    const raw = body as Record<string, unknown>;
    if (status >= 400 || raw.message) {
      return NextResponse.json({ image: null, total: 0 }, { status: 404 });
    }
    const images = (raw.images ?? []) as string[];
    return NextResponse.json(
      { image: images[0] ?? null, total: images.length },
      { headers: { "Cache-Control": "public, max-age=600" } }
    );
  } catch (err) {
    console.error("Image fetch error:", err);
    return NextResponse.json({ image: null, total: 0 }, { status: 500 });
  }
}
