"use client";



import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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

export default function ListingsClient() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    searchByText: `${searchParams.get("city") ?? siteConfig.api.defaultCity}, ${siteConfig.api.defaultProvince}, Canada`,
    listingType: [(searchParams.get("type") ?? "Sale")],
  }));

  const fetchListings = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    try {
      const res = await fetch("/api/listings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: {
            searchType: f.searchType,
            listingType: f.listingType,
            searchByText: f.searchByText,
            bed: f.bed,
            bath: f.bath,
            priceRange: { min: f.priceMin, max: f.priceMax },
            propertyType: f.propertyType,
            sortby: f.sortby,
            page: f.page,
            limit: f.limit,
          },
        }),
      });
      const data = await res.json();
      setListings(data.listings ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchListings(filters); }, [filters, fetchListings]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, searchByText: searchInput || f.searchByText }));
  }

  const city = filters.searchByText.split(",")[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search bar row */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 min-w-0 flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={filters.searchByText}
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
          onChange={(partial) => setFilters((f) => ({ ...f, ...partial }))}
          totalCount={total}
        />

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {loading ? "Searching…" : `${total} Properties in ${city}`}
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
              <p className="text-gray-500 mb-6">Try adjusting your filters or searching a different area.</p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-6 py-3 rounded-full text-white font-semibold"
                style={{ background: "var(--primary)" }}
              >
                Clear Filters
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
