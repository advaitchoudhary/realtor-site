"use client";

import { use, useEffect, useState } from "react";
import { Listing } from "@/lib/types";
import { formatPrice, formatArea } from "@/lib/utils";
import Link from "next/link";
import {
  Bed, Bath, Car, Maximize2, MapPin, Calendar, Home,
  Share2, Heart, ChevronLeft, ChevronRight, Phone, Mail, ExternalLink
} from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/config";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setListing(null); } else { setListing(d as Listing); }
      })
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-6">
        <div className="skeleton h-96 rounded-2xl mb-6" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-2xl font-bold text-gray-700 mb-4">Listing not found</p>
        <Link href="/listings" className="text-[var(--primary)] underline">Browse all listings</Link>
      </div>
    );
  }

  const images = listing.Images?.length ? listing.Images : [listing.MainImage];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
        <nav className="text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-[var(--primary)]">Listings</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{listing.Address}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        {/* Image gallery */}
        <div className="relative rounded-3xl overflow-hidden mb-8 aspect-[16/7] bg-gray-200">
          <img
            src={images[imgIdx] || "https://picsum.photos/id/1029/1200/600"}
            alt={listing.Address}
            className="w-full h-full object-cover"
          />
          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ background: i === imgIdx ? "var(--accent)" : "rgba(255,255,255,0.6)" }}
                  />
                ))}
              </div>
            </>
          )}
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
              For {listing.ListingType}
            </span>
            {listing.DaysOnMarket <= 3 && (
              <span className="px-3 py-1.5 rounded-full text-sm font-bold text-white bg-rose-500">New</span>
            )}
          </div>
          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <Heart size={18} fill={saved ? "var(--accent)" : "none"} stroke={saved ? "var(--accent)" : "currentColor"} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-[var(--accent)]" : "border-transparent opacity-70"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{listing.Address}</h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={16} />
                    <span>{listing.City}, {listing.Province} {listing.PostalCode}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                    {formatPrice(listing.Price)}
                  </div>
                  {listing.ListingType === "Lease" && <div className="text-sm text-gray-500">/month</div>}
                </div>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: "Bedrooms", value: listing.Bedrooms },
                { icon: Bath, label: "Bathrooms", value: listing.Bathrooms },
                { icon: Car, label: "Parking", value: listing.Parking > 0 ? listing.Parking : "—" },
                { icon: Maximize2, label: "Area", value: listing.Area > 0 ? formatArea(listing.Area) : "—" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                  <stat.icon size={20} className="mx-auto mb-2" style={{ color: "var(--primary)" }} />
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                {[
                  { label: "Property Type", value: listing.PropertyType },
                  { label: "Style", value: listing.Style },
                  { label: "Year Built", value: listing.YearBuilt || "—" },
                  { label: "MLS Number", value: listing.MLS },
                  { label: "Lot Frontage", value: listing.LotFrontage ? `${listing.LotFrontage} ft` : "—" },
                  { label: "Lot Depth", value: listing.LotDepth ? `${listing.LotDepth} ft` : "—" },
                  { label: "Days on Market", value: `${listing.DaysOnMarket} days` },
                  { label: "Listing Type", value: `For ${listing.ListingType}` },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{d.label}</div>
                    <div className="font-medium text-gray-800">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--primary)] mb-4">About This Property</h2>
              <p className="text-gray-600 leading-relaxed">{listing.Description}</p>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Location</h2>
              <div className="rounded-xl overflow-hidden h-64 map-placeholder flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={40} className="mx-auto mb-3 text-[var(--primary)] opacity-40" />
                  <p className="text-gray-500 text-sm">{listing.Address}, {listing.City}</p>
                  <a
                    href={`https://maps.google.com?q=${encodeURIComponent(listing.Address + ", " + listing.City + ", " + listing.Province)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[var(--primary)] hover:underline"
                  >
                    View on Google Maps <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact sidebar */}
          <div className="space-y-5">
            {/* Agent card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="https://picsum.photos/id/1005/100/100"
                  alt={siteConfig.agent.name}
                  className="w-16 h-16 rounded-full object-cover border-2"
                  style={{ borderColor: "var(--accent)" }}
                />
                <div>
                  <div className="font-bold text-[var(--primary)]">{siteConfig.agent.name}</div>
                  <div className="text-xs text-gray-500">{siteConfig.agent.title}</div>
                  <div className="text-xs text-gray-400">{siteConfig.agent.license}</div>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                <a
                  href={`tel:${siteConfig.agent.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-[var(--secondary)] transition-colors text-sm font-medium text-[var(--primary)]"
                >
                  <Phone size={16} style={{ color: "var(--accent)" }} />
                  {siteConfig.agent.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.agent.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-[var(--secondary)] transition-colors text-sm font-medium text-[var(--primary)]"
                >
                  <Mail size={16} style={{ color: "var(--accent)" }} />
                  {siteConfig.agent.email}
                </a>
              </div>
            </div>

            {/* Inquiry form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-[var(--primary)] mb-4">Request Information</h3>
              <ContactForm
                compact
                defaultMessage={`Hi, I'm interested in ${listing.Address}. Please contact me with more details.`}
                listingId={listing._id}
                listingAddress={listing.Address}
                listingPrice={listing.Price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
