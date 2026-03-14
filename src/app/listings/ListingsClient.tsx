"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Listing, SearchFilters } from "@/lib/types";
import ListingCard from "@/components/listings/ListingCard";
import SearchFiltersPanel from "@/components/listings/SearchFilters";
import { siteConfig } from "@/lib/config";
import { Search, MapPin, Grid3X3, List, Map } from "lucide-react";
import Link from "next/link";

const DEFAULT_FILTERS: SearchFilters = {
  searchByText: "",
  listingType: ["Sale"],
  searchType: "residential",
  bed: 0,
  bath: 0,
  priceMin: 0,
  priceMax: 0,
  sortby: "newest",
  propertyType: "",
  page: 1,
  limit: 18,
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ListingsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ddfQuery = searchParams.get("search") ?? "";
  const cityParam = searchParams.get("city") ?? siteConfig.api.defaultCity;
  const listingType = searchParams.get("type") ?? "Sale";
  const nearLat = parseFloat(searchParams.get("lat") ?? "");
  const nearLng = parseFloat(searchParams.get("lng") ?? "");
  const nearLabel = searchParams.get("near") ?? "";
  const hasProximity = !isNaN(nearLat) && !isNaN(nearLng);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [ddfError, setDdfError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(ddfQuery);
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    searchByText: ddfQuery || `${cityParam}, ${siteConfig.api.defaultProvince}, Canada`,
    listingType: [listingType],
    area: ddfQuery ? undefined : cityParam,
  }));

  const isDdfMode = !!ddfQuery;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      if (isDdfMode) {
        const res = await fetch("/api/listings/ddf-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: ddfQuery,
            page: filters.page,
            limit: filters.limit,
          }),
        });
        const data = await res.json();
        if (data.error && res.status >= 400) {
          setListings([]);
          setTotal(0);
          setDdfError(res.status === 503 ? "DDF search is not configured. Add DDF_CLIENT_ID and DDF_CLIENT_SECRET to .env.local." : data.error);
        } else {
          setDdfError(null);
          setListings(data.listings ?? []);
          setTotal(data.total ?? 0);
        }
      } else {
        const res = await fetch("/api/listings/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search: {
              searchType: filters.searchType,
              listingType: filters.listingType,
              searchByText: `${cityParam}, ${siteConfig.api.defaultProvince}, Canada`,
              bed: filters.bed,
              bath: filters.bath,
              priceRange: { min: filters.priceMin, max: filters.priceMax },
              propertyType: filters.propertyType,
              sortby: filters.sortby,
              page: filters.page,
              limit: filters.limit,
            },
          }),
        });
        const data = await res.json();
        let results: Listing[] = data.listings ?? [];
        if (hasProximity && results.length > 0) {
          results = [...results].sort((a, b) =>
            haversineKm(nearLat, nearLng, a.Latitude, a.Longitude) -
            haversineKm(nearLat, nearLng, b.Latitude, b.Longitude)
          );
        }
        setListings(results);
        setTotal(data.total ?? 0);
        setDdfError(null);
      }
    } catch {
      setListings([]);
      setDdfError(isDdfMode ? "Search failed. Check your DDF credentials." : null);
    } finally {
      setLoading(false);
    }
  }, [isDdfMode, ddfQuery, cityParam, filters.page, filters.limit, filters.searchType, filters.listingType, filters.bed, filters.bath, filters.priceMin, filters.priceMax, filters.propertyType, filters.sortby]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    setSearchInput(ddfQuery);
  }, [ddfQuery]);

  useEffect(() => {
    if (!ddfQuery) setFilters((f) => ({ ...f, area: cityParam }));
  }, [cityParam, ddfQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      router.push(`/listings?search=${encodeURIComponent(q)}&type=${filters.listingType[0]}`);
    } else {
      const city = filters.searchByText.split(",")[0] || cityParam;
      router.push(`/listings?city=${encodeURIComponent(city)}&type=${filters.listingType[0]}`);
    }
  }

  const headerLabel = isDdfMode
    ? (loading ? "Searching…" : `${total} Properties matching "${ddfQuery}"`)
    : hasProximity
    ? (loading ? "Searching…" : `${total} Properties near "${nearLabel || cityParam}"`)
    : (loading ? "Searching…" : `${total} Properties in ${cityParam}`);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28">
      {/* Search bar row */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-20 lg:top-24 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 min-w-0 flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Address or MLS® Number"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="p-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              <Search size={16} />
            </button>
          </form>

          {/* View modes */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-400"}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-400"}`}>
              <List size={16} />
            </button>
          </div>

          <Link
            href="/listings/map"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            <Map size={16} />
            <span className="hidden sm:inline">Map View</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex gap-8">
        {/* Filters sidebar */}
        <SearchFiltersPanel
          filters={filters}
          onChange={(partial) => {
            setFilters((f) => ({ ...f, ...partial }));
            if ("area" in partial && partial.area && !ddfQuery) {
              router.push(`/listings?city=${encodeURIComponent(partial.area)}&type=${partial.listingType?.[0] ?? filters.listingType[0]}`);
            }
          }}
          totalCount={total}
        />

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {headerLabel}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filters.listingType[0] === "Sale" ? "For Sale" : "For Lease"}
              </p>
            </div>
          </div>

          {/* Grid / List */}
          {loading ? (
            <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                  <div className="skeleton h-52" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="skeleton h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🏡</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No listings found</h3>
              <p className="text-gray-500 mb-6">
                {ddfError ?? "Try adjusting your filters or searching a different area."}
              </p>
              <button
                onClick={() =>
                  isDdfMode
                    ? router.push(`/listings?city=${siteConfig.api.defaultCity}&type=Sale`)
                    : setFilters({ ...DEFAULT_FILTERS, searchByText: `${cityParam}, ${siteConfig.api.defaultProvince}, Canada`, listingType: ["Sale"] })
                }
                className="px-6 py-3 rounded-full text-white font-semibold"
                style={{ background: "var(--primary)" }}
              >
                {isDdfMode ? "Browse by City" : "Clear Filters"}
              </button>
            </div>
          ) : (
            <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  className={viewMode === "list" ? "sm:flex" : ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
