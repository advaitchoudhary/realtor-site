"use client";

import { SearchFilters } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  filters: SearchFilters;
  onChange: (f: Partial<SearchFilters>) => void;
  totalCount: number;
}

const PRICE_MAX = 5000000;
const pricePresets = [
  { label: "Any", min: 0, max: 0 },
  { label: "Under $500K", min: 0, max: 500000 },
  { label: "$500K–$1M", min: 500000, max: 1000000 },
  { label: "$1M–$2M", min: 1000000, max: 2000000 },
  { label: "$2M+", min: 2000000, max: 0 },
];

const bedOptions = [0, 1, 2, 3, 4, 5];
const bathOptions = [0, 1, 2, 3, 4];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "beds_desc", label: "Most Bedrooms" },
];
const propertyTypes = [
  { value: "", label: "All Types" },
  { value: "detached", label: "Detached" },
  { value: "semidetached", label: "Semi-Detached" },
  { value: "condo", label: "Condo" },
  { value: "townhomes", label: "Townhouse" },
];

const AREAS = ["Brampton", "Mississauga", "Milton", "Caledon", "Georgetown", "Bolton"];

export default function SearchFiltersPanel({ filters, onChange, totalCount }: Props) {
  const [showMobile, setShowMobile] = useState(false);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Listing Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Listing Type
        </label>
        <div className="flex gap-2">
          {["Sale", "Lease"].map((t) => (
            <button
              key={t}
              onClick={() => onChange({ listingType: [t] })}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                filters.listingType[0] === t
                  ? "text-white border-transparent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
              style={filters.listingType[0] === t ? { background: "var(--primary)", borderColor: "var(--primary)" } : {}}
            >
              {t === "Sale" ? "For Sale" : "For Lease"}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Area
        </label>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => onChange({ area })}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filters.area === area
                  ? "text-white border-transparent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
              style={filters.area === area ? { background: "var(--primary)" } : {}}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Property Type
        </label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((pt) => (
            <button
              key={pt.value}
              onClick={() => onChange({ propertyType: pt.value })}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filters.propertyType === pt.value
                  ? "text-white border-transparent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
              style={filters.propertyType === pt.value ? { background: "var(--primary)" } : {}}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Price Range
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {pricePresets.map((p) => (
            <button
              key={p.label}
              onClick={() => onChange({ priceMin: p.min, priceMax: p.max })}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filters.priceMin === p.min && filters.priceMax === p.max
                  ? "text-white border-transparent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
              style={filters.priceMin === p.min && filters.priceMax === p.max ? { background: "var(--accent)" } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Min: {filters.priceMin > 0 ? formatPrice(filters.priceMin) : "Any"}</span>
            <span>Max: {filters.priceMax > 0 ? formatPrice(filters.priceMax) : "Any"}</span>
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Bedrooms (min)
        </label>
        <div className="flex gap-2">
          {bedOptions.map((b) => (
            <button
              key={b}
              onClick={() => onChange({ bed: b })}
              className={cn(
                "w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-all",
                filters.bed === b
                  ? "text-white border-transparent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
              style={filters.bed === b ? { background: "var(--primary)" } : {}}
            >
              {b === 0 ? "Any" : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Bathrooms (min)
        </label>
        <div className="flex gap-2">
          {bathOptions.map((b) => (
            <button
              key={b}
              onClick={() => onChange({ bath: b })}
              className={cn(
                "w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-all",
                filters.bath === b
                  ? "text-white border-transparent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
              style={filters.bath === b ? { background: "var(--primary)" } : {}}
            >
              {b === 0 ? "Any" : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Sort By
        </label>
        <select
          value={filters.sortby}
          onChange={(e) => onChange({ sortby: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ bed: 0, bath: 0, priceMin: 0, priceMax: 0, listingType: ["Sale"], propertyType: "", sortby: "newest", area: undefined })}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all flex items-center justify-center gap-2"
      >
        <X size={14} />
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 lg:top-32 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[var(--primary)] flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Filters
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {totalCount} results
            </span>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile filter button */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobile(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {(filters.bed > 0 || filters.bath > 0 || filters.priceMin > 0 || filters.priceMax > 0) && (
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          )}
        </button>

        {showMobile && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobile(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="font-bold text-[var(--primary)]">Filters · {totalCount} results</h2>
                <button onClick={() => setShowMobile(false)}><X size={20} /></button>
              </div>
              <div className="p-5">
                <FilterContent />
              </div>
              <div className="p-5 border-t">
                <button
                  onClick={() => setShowMobile(false)}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  Show {totalCount} Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
