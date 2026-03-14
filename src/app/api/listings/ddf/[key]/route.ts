import { NextRequest, NextResponse } from "next/server";
import { getPropertyByKey, DdfError } from "@/lib/ddf";

/**
 * GET /api/listings/ddf/[key]
 * Fetch full property by PropertyKey (ListingKey)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    if (!key) {
      return NextResponse.json({ error: "Property key required" }, { status: 400 });
    }

    const listing = await getPropertyByKey(key);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (err) {
    if (err instanceof DdfError) {
      if (err.code === "AUTH") {
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
      }
      if (err.code === "RATE_LIMIT") {
        return NextResponse.json(
          { error: "Rate limited. Please try again later." },
          { status: 429 }
        );
      }
      if (err.code === "CONFIG") {
        return NextResponse.json({ error: "DDF API not configured" }, { status: 503 });
      }
    }
    console.error("DDF property fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}
