import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(sqft: number): string {
  return new Intl.NumberFormat("en-CA").format(sqft) + " sq ft";
}

export function buildIncomSearchPayload(params: {
  searchByText: string;
  lat: number;
  lng: number;
  zoom: number;
  bounds?: { south: number; west: number; north: number; east: number };
  listingType?: string[];
  searchType?: string;
  bed?: number;
  bath?: number;
  priceMin?: number;
  priceMax?: number;
  sortby?: string;
  page?: number;
  limit?: number;
  selectedPathID?: string;
}) {
  const {
    searchByText,
    lat,
    lng,
    zoom,
    bounds = { south: lat - 0.35, west: lng - 0.55, north: lat + 0.35, east: lng + 0.55 },
    listingType = ["Sale"],
    searchType = "residential",
    bed = 0,
    bath = 0,
    priceMin = 0,
    priceMax = 0,
    sortby = "newest",
    selectedPathID = "",
  } = params;

  const payload = {
    search: {
      searchType,
      listingType,
      openHouse: { from: 0, to: 0 },
      bed,
      marketdays: 0,
      bath,
      searchBy: "searchall",
      searchByText,
      priceRange: { min: priceMin, max: priceMax },
      feetRange: { min: 0, max: 0 },
      showOnly: [],
      priceDrop: false,
      powerOfSale: false,
      sortby,
      condoType: "",
      condoOccupancy: "",
      condoStatus: "",
      condoBuilder: "",
      keywords: [],
      PostalCode: false,
      Province: false,
      City: false,
    },
    location: {
      Longitude: lng,
      Latitude: lat,
      Zoom: zoom,
      mapViewType: "roadmap",
      mapInfoType: [],
      selectedPathID,
      Bounds: bounds,
    },
    controlSpecial: {},
  };

  return btoa(JSON.stringify(payload));
}
