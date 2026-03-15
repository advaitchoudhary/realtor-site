export interface Listing {
  _id: string;
  MLS: string;
  ListingType: "Sale" | "Lease";
  SearchType: "residential" | "commercial";
  Address: string;
  City: string;
  Province: string;
  PostalCode: string;
  Price: number;
  Bedrooms: number;
  Bathrooms: number;
  Parking: number;
  Area: number;
  LotFrontage: string;
  LotDepth: string;
  PropertyType: string;
  Style: string;
  YearBuilt: string;
  Description: string;
  Images: string[];
  MainImage: string;
  Latitude: number;
  Longitude: number;
  DaysOnMarket: number;
  ListDate: string;
  UpdatedDate: string;
  OpenHouse?: {
    Date: string;
    From: string;
    To: string;
  }[];
  VirtualTour?: string;
}

export interface SearchFilters {
  searchByText: string;
  listingType: string[];
  searchType: string;
  bed: number;
  bath: number;
  priceMin: number;
  priceMax: number;
  sortby: string;
  propertyType?: string;
  area?: string;
  page: number;
  limit: number;
}

export interface SearchResult {
  listings: Listing[];
  total: number;
  page: number;
  pages: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  listingId?: string;
  listingAddress?: string;
  listingPrice?: number;
  type: "general" | "listing" | "valuation" | "buyer";
  source?: "contact" | "listing" | "home-value" | "mortgage" | "affordability" | "land-transfer-tax" | "other";
  status: "new" | "contacted" | "closed";
  createdAt: string;
  notes?: string;
}
