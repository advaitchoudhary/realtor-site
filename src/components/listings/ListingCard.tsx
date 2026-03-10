import Link from "next/link";
import { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Bed, Bath, Car, Maximize2, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import LazyListingImage from "./LazyListingImage";

interface Props {
  listing: Listing;
  className?: string;
}

export default function ListingCard({ listing, className }: Props) {
  const isNew = listing.DaysOnMarket <= 3;
  const hasOpenHouse = listing.OpenHouse && listing.OpenHouse.length > 0;

  return (
    <Link href={`/listings/${listing._id}`} className={cn("block", className)}>
      <article className="listing-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Image — lazy loaded via IntersectionObserver */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <LazyListingImage
            id={listing._id}
            address={listing.Address}
            className="transition-transform duration-500 hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                listing.ListingType === "Sale" ? "bg-[var(--primary)]" : "bg-emerald-600"
              }`}
            >
              For {listing.ListingType === "Sale" ? "Sale" : "Lease"}
            </span>
            {isNew && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-rose-500">
                New
              </span>
            )}
            {hasOpenHouse && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-purple-600">
                Open House
              </span>
            )}
          </div>

          {/* Price */}
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-black/60 backdrop-blur-sm">
              {formatPrice(listing.Price)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {listing.Address}
            </h3>
            <span className="text-xs text-gray-400 shrink-0 mt-0.5">{listing.MLS}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin size={12} />
            <span>{listing.City}, {listing.Province}</span>
          </div>

          <div className="h-px bg-gray-100 mb-3" />

          {/* Details */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <Bed size={13} className="text-[var(--primary)]" />
              {listing.Bedrooms} {listing.Bedrooms === 1 ? "Bed" : "Beds"}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-[var(--primary)]" />
              {listing.Bathrooms} {listing.Bathrooms === 1 ? "Bath" : "Baths"}
            </span>
            {listing.Parking > 0 && (
              <span className="flex items-center gap-1.5">
                <Car size={13} className="text-[var(--primary)]" />
                {listing.Parking}
              </span>
            )}
            {listing.Area > 0 && (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={13} className="text-[var(--primary)]" />
                {listing.Area.toLocaleString()}
              </span>
            )}
          </div>

          {listing.DaysOnMarket > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2.5">
              <Calendar size={11} />
              {listing.DaysOnMarket} days on market
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
