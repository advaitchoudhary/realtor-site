"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/listings/ListingCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

const CITIES = ["Brampton", "Mississauga", "Milton", "Caledon", "Georgetown", "Bolton"];

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const perPage = 3;

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        CITIES.map((city) =>
          fetch("/api/listings/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              search: {
                searchType: "residential",
                listingType: ["Sale"],
                searchByText: `${city}, ${siteConfig.api.defaultProvince}, Canada`,
                bed: 0,
                bath: 0,
                priceRange: { min: 0, max: 0 },
                propertyType: "",
                sortby: "newest",
                page: 1,
                limit: 3,
              },
            }),
          }).then((r) => r.json())
        )
      );

      const merged: Listing[] = [];
      const seen = new Set<string>();
      for (const r of results) {
        for (const l of r.listings ?? []) {
          if (l._id && !seen.has(l._id)) {
            seen.add(l._id);
            merged.push(l);
          }
        }
      }
      setListings(merged.slice(0, 9));
    };

    fetchAll().catch(() => setListings([])).finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(listings.length / perPage) || 1;
  const visible = listings.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Fresh on the market
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--primary)]">
              Featured Listings
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="skeleton h-56" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {/* View all */}
        <div className="text-center mt-12">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:gap-3"
            style={{ background: "var(--primary)" }}
          >
            View All Listings
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
