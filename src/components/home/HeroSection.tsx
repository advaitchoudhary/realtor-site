"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const popularCities = ["Brampton", "Mississauga", "Milton", "Caledon", "Georgetown", "Bolton"];
const LIBRARIES: ("places")[] = ["places"];

export default function HeroSection() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [listingType, setListingType] = useState("Sale");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
    libraries: LIBRARIES,
  });

  function onPlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    const city = place.address_components?.find((c) => c.types.includes("locality"))?.long_name
      ?? place.address_components?.find((c) => c.types.includes("sublocality"))?.long_name
      ?? place.name
      ?? "";
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (city) {
      const params = new URLSearchParams({ city, type: listingType });
      if (lat != null && lng != null) {
        params.set("lat", lat.toFixed(6));
        params.set("lng", lng.toFixed(6));
        params.set("near", place.name ?? city);
      }
      router.push(`/listings?${params.toString()}`);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = searchText.trim();
    if (query) {
      router.push(`/listings?search=${encodeURIComponent(query)}&type=${listingType}`);
    } else {
      router.push(`/listings?city=${encodeURIComponent(siteConfig.api.defaultCity)}&type=${listingType}`);
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=1920&q=85)`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-20">
        <div className="animate-fadeInUp">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>
            {siteConfig.agent.title}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Find Your Perfect
            <span className="block" style={{ color: "var(--accent)" }}>
              Dream Home
            </span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            With {siteConfig.agent.name}, discover thousands of listings across
            Ontario. Expert guidance every step of the way.
          </p>

          {/* Search box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 shadow-2xl max-w-3xl mx-auto">
            <form onSubmit={handleSearch}>
              {/* Type tabs */}
              <div className="flex gap-2 mb-3">
                {["Sale", "Lease"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setListingType(t)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      listingType === t
                        ? "text-[var(--primary)]"
                        : "text-white/70 hover:text-white"
                    }`}
                    style={listingType === t ? { background: "var(--accent)" } : {}}
                  >
                    {t === "Sale" ? "Buy" : "Rent"}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={(ac) => { autocompleteRef.current = ac; }}
                      onPlaceChanged={onPlaceChanged}
                      options={{ componentRestrictions: { country: "ca" }, fields: ["address_components", "geometry", "name"] }}
                    >
                      <input
                        type="text"
                        placeholder="Address, city or neighbourhood…"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-2 ring-[var(--accent)] transition-all"
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      type="text"
                      placeholder="Address, city or neighbourhood…"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-2 ring-[var(--accent)] transition-all"
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-105 shrink-0"
                  style={{ background: "var(--primary)" }}
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick city pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-white/60 text-sm self-center mr-1">Popular:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => router.push(`/listings?city=${encodeURIComponent(city)}&type=Sale`)}
                className="px-4 py-1.5 rounded-full text-xs text-white/80 border border-white/25 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={28} className="text-white/50" />
      </div>
    </section>
  );
}
