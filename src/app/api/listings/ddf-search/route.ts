import { NextRequest, NextResponse } from "next/server";
import { searchProperties, DdfError } from "@/lib/ddf";

/**
 * POST /api/listings/ddf-search
 * Search by address or MLS® number (property name)
 * Body: { query: string, page?: number, limit?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query ?? "").trim();
    const page = Math.max(1, Number(body.page) ?? 1);
    const limit = Math.min(50, Math.max(1, Number(body.limit) ?? 18));

    if (!query) {
      return NextResponse.json(
        { listings: [], total: 0, page: 1, pages: 0, error: "Query is required" },
        { status: 400 }
      );
    }

    const result = await searchProperties({ query, page, limit });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof DdfError) {
      if (err.code === "AUTH") {
        return NextResponse.json(
          { error: "Authentication failed. Check DDF credentials." },
          { status: 401 }
        );
      }
      if (err.code === "RATE_LIMIT") {
        return NextResponse.json(
          { error: "Rate limited. Please try again later." },
          { status: 429 }
        );
      }
      if (err.code === "CONFIG") {
        return NextResponse.json(
          { error: "DDF API not configured." },
          { status: 503 }
        );
      }
    }
    console.error("DDF search error:", err);
    return NextResponse.json(
      { listings: [], total: 0, page: 1, pages: 0, error: "Search failed" },
      { status: 500 }
    );
  }
}
