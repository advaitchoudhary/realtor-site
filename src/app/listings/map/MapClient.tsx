"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, Autocomplete } from "@react-google-maps/api";
import { Listing, SearchFilters } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { MapPin, Search, ArrowLeft, Bed, Bath, MapPinned } from "lucide-react";
import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";

const LIBRARIES: ("places")[] = ["places"];

function MapView({
  listings,
  hoveredId,
  setHoveredId,
  selectedPin,
  setSelectedPin,
  mapRef,
  isLoaded,
  loadError,
}: {
  listings: Listing[];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  selectedPin: Listing | null;
  setSelectedPin: (l: Listing | null) => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  isLoaded: boolean;
  loadError: Error | undefined;
}) {
  const center = { lat: siteConfig.api.defaultLat, lng: siteConfig.api.defaultLng };
  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, [mapRef]);

  useEffect(() => {
    if (!mapRef.current || listings.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    listings.forEach((l) => bounds.extend({ lat: l.Latitude, lng: l.Longitude }));
    mapRef.current.fitBounds(bounds, 60);
  }, [listings, mapRef]);

  const pinIcon = (active: boolean) => ({
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: active ? "#C9A84C" : "#1a1a1a",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.5,
    scale: active ? 1.8 : 1.4,
    anchor: new google.maps.Point(12, 22),
  });

  if (loadError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <MapPinned size={48} className="text-gray-300 mb-4" />
        <p className="font-semibold text-gray-700 mb-2">Google Maps failed to load</p>
        <p className="text-sm text-gray-500 max-w-md mb-4">
          ApiProjectMapError usually means: (1) Add <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to .env.local, (2) Enable &quot;Maps JavaScript API&quot; in Google Cloud Console, (3) Enable billing on your project.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
        <div className="text-center text-gray-400">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading map…</p>
        </div>
      </div>
    );
  }

  const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
  const MAP_OPTIONS: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
    ],
  };

  return (
    <GoogleMap mapContainerStyle={MAP_CONTAINER_STYLE} center={center} zoom={siteConfig.api.defaultZoom} options={MAP_OPTIONS} onLoad={onMapLoad} onClick={() => setSelectedPin(null)}>
      {listings.map((listing) => (
        <MarkerF key={listing._id} position={{ lat: listing.Latitude, lng: listing.Longitude }}
          icon={pinIcon(hoveredId === listing._id || selectedPin?._id === listing._id)}
          onMouseOver={() => setHoveredId(listing._id)} onMouseOut={() => setHoveredId(null)}
          onClick={() => setSelectedPin(selectedPin?._id === listing._id ? null : listing)} />
      ))}
      {selectedPin && (
        <InfoWindowF position={{ lat: selectedPin.Latitude, lng: selectedPin.Longitude }} onCloseClick={() => setSelectedPin(null)} options={{ pixelOffset: new google.maps.Size(0, -30) }}>
          <div className="w-64 font-sans">
            {selectedPin.MainImage && (
              <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden rounded-t-lg">
                <img src={selectedPin.MainImage} alt={selectedPin.Address} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2"><span className="px-2 py-0.5 rounded-md text-xs font-bold text-white" style={{ background: "#1a1a1a" }}>{formatPrice(selectedPin.Price)}</span></div>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{selectedPin.Address}</h3>
            <p className="text-xs text-gray-500 mb-2">{selectedPin.City}, {selectedPin.Province}</p>
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
              <span className="flex items-center gap-1"><Bed size={11} /> {selectedPin.Bedrooms} beds</span>
              <span className="flex items-center gap-1"><Bath size={11} /> {selectedPin.Bathrooms} baths</span>
            </div>
            <Link href={`/listings/${selectedPin._id}`} className="block w-full py-1.5 text-center text-xs font-semibold text-white rounded-lg" style={{ background: "#1a1a1a" }}>View Details →</Link>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

const DEFAULT_FILTERS: SearchFilters = {
  searchByText: `${siteConfig.api.defaultCity}, ${siteConfig.api.defaultProvince}, Canada`,
  listingType: ["Sale"],
  searchType: "residential",
  bed: 0, bath: 0,
  priceMin: 0, priceMax: 0,
  sortby: "newest",
  propertyType: "",
  page: 1, limit: 100,
};

export default function MapClient() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    searchByText: `${searchParams.get("city") ?? siteConfig.api.defaultCity}, ON, Canada`,
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<Listing | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";
  const hasMapsKey = !!mapsKey.trim();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsKey,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    fetchListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function fetchListings() {
    setLoading(true);
    try {
      const res = await fetch("/api/listings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: {
            searchType: filters.searchType,
            listingType: filters.listingType,
            searchBy: "searchall",
            searchByText: filters.searchByText,
            bed: filters.bed, bath: filters.bath,
            priceRange: { min: filters.priceMin, max: filters.priceMax },
            feetRange: { min: 0, max: 0 },
            sortby: filters.sortby,
            openHouse: { from: 0, to: 0 },
            marketdays: 0, showOnly: [], priceDrop: false, powerOfSale: false,
            condoType: "", condoOccupancy: "", condoStatus: "", condoBuilder: "",
            keywords: [], PostalCode: false, Province: false, City: false,
          },
          location: { Latitude: siteConfig.api.defaultLat, Longitude: siteConfig.api.defaultLng, Zoom: 9 },
        }),
      });
      const data = await res.json();
      const valid = (data.listings ?? []).filter(
        (l: Listing) => l.Latitude && l.Longitude && l.Latitude !== 0 && l.Longitude !== 0
      );
      setListings(valid);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  function onPlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;

    // Pan map to selected location
    if (place.geometry?.location && mapRef.current) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
    }

    // Extract city and update search filter using city-based Incom API
    const city = place.address_components?.find((c) => c.types.includes("locality"))?.long_name
      ?? place.address_components?.find((c) => c.types.includes("sublocality"))?.long_name
      ?? place.name
      ?? "";
    if (city) {
      const searchByText = `${city}, ON, Canada`;
      setFilters((f) => ({ ...f, searchByText }));
      setSearchInput(city);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchInput.trim()) {
      setFilters((f) => ({ ...f, searchByText: searchInput.trim() }));
    }
  }

  return (
    <div className="h-screen flex flex-col pt-20 overflow-hidden">
      <div className="bg-white border-b border-gray-100 shadow-sm z-30 px-4 py-3 flex flex-wrap items-center gap-3">
        <Link href="/listings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--primary)] transition-colors shrink-0">
          <ArrowLeft size={16} /> Back to List
        </Link>
        <form onSubmit={handleSearch} className="flex-1 min-w-0 flex items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            {isLoaded ? (
              <Autocomplete
                onLoad={(ac) => { autocompleteRef.current = ac; }}
                onPlaceChanged={onPlaceChanged}
                options={{ componentRestrictions: { country: "ca" }, fields: ["address_components", "geometry", "name"] }}
              >
                <input
                  type="text"
                  placeholder="Search address, city, neighbourhood…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                placeholder="Search address, city, neighbourhood…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
              />
            )}
          </div>
          <button type="submit" className="p-2 rounded-xl text-white" style={{ background: "var(--primary)" }}>
            <Search size={15} />
          </button>
        </form>
        <div className="flex items-center gap-2 flex-wrap">
          {["Sale", "Lease"].map((t) => (
            <button key={t} onClick={() => setFilters((f) => ({ ...f, listingType: [t] }))}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={filters.listingType[0] === t ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "#e5e7eb", color: "#374151" }}>
              For {t === "Sale" ? "Sale" : "Lease"}
            </button>
          ))}
          {[1, 2, 3].map((b) => (
            <button key={b} onClick={() => setFilters((f) => ({ ...f, bed: f.bed === b ? 0 : b }))}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={filters.bed === b ? { background: "var(--accent)", color: "white", borderColor: "var(--accent)" } : { borderColor: "#e5e7eb", color: "#374151" }}>
              {b}+ <span className="hidden sm:inline">Beds</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto shrink-0">{loading ? "…" : listings.length} properties</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex flex-col w-96 border-r border-gray-100 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-xl" />)}</div>
          ) : (
            <div className="p-3 space-y-3">
              {listings.map((listing) => (
                <div key={listing._id} onMouseEnter={() => setHoveredId(listing._id)} onMouseLeave={() => setHoveredId(null)}
                  onClick={() => { setSelectedPin(listing); mapRef.current?.panTo({ lat: listing.Latitude, lng: listing.Longitude }); mapRef.current?.setZoom(15); }}
                  className={`transition-all cursor-pointer ${hoveredId === listing._id ? "ring-2 ring-[var(--accent)] rounded-2xl" : ""}`}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative overflow-hidden">
          {!hasMapsKey ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
              <MapPinned size={48} className="text-gray-300 mb-4" />
              <p className="font-semibold text-gray-700 mb-2">Map not configured</p>
              <p className="text-sm text-gray-500 max-w-md mb-4">
                Add <code className="bg-gray-200 px-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to your .env.local file.
              </p>
            </div>
          ) : (
            <MapView listings={listings} hoveredId={hoveredId} setHoveredId={setHoveredId} selectedPin={selectedPin} setSelectedPin={setSelectedPin} mapRef={mapRef} isLoaded={isLoaded} loadError={loadError} />
          )}
        </div>
      </div>
    </div>
  );
}
