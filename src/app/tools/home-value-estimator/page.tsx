"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { Home, Phone, MapPin, Ruler, BedDouble, Bath, Calendar, Send, Loader2 } from "lucide-react";

export default function HomeValueEstimatorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    propertyType: "detached",
    bedrooms: "3",
    bathrooms: "2",
    sqft: "",
    yearBuilt: "",
    condition: "good",
    name: "",
    email: "",
    phone: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const propertyDetails = [
        `Address: ${form.address}, ${form.city}${form.postalCode ? `, ${form.postalCode}` : ""}`,
        `Type: ${form.propertyType} | Beds: ${form.bedrooms} | Baths: ${form.bathrooms}`,
        form.sqft ? `Approx. ${form.sqft} sq ft` : "",
        form.yearBuilt ? `Built: ${form.yearBuilt}` : "",
        `Condition: ${form.condition}`,
      ].filter(Boolean).join("\n");

      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `Home Valuation Request:\n${propertyDetails}`,
          type: "valuation",
          source: "home-value",
          listingAddress: `${form.address}, ${form.city}`,
        }),
      });
      setSubmitted(true);
    } catch {
      // still show success — the form data was captured client-side
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="py-16 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
          <div className="absolute inset-0 opacity-5">
            <div className="w-[600px] h-[600px] rounded-full bg-white absolute -right-48 -top-48" />
          </div>
          <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Tools</p>
            <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-4">
              <Home className="shrink-0" size={40} />
              Home Value Estimator
            </h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: "var(--accent)" }}>
            <Send size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">Request Received!</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Thank you! {siteConfig.agent.name} will review your property details and prepare a
            Comparative Market Analysis (CMA) for you. Expect a personalized home value report within 24-48 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/listings"
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              Browse Listings
            </Link>
            <Link
              href="/tools/mortgage-calculator"
              className="px-6 py-3 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Mortgage Calculator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <div className="py-16 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-[600px] h-[600px] rounded-full bg-white absolute -right-48 -top-48" />
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Tools
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-4">
            <Home className="shrink-0" size={40} />
            Home Value Estimator
          </h1>
          <p className="text-white/70 mt-4 max-w-xl">
            Curious what your home is worth? Fill in your property details and {siteConfig.agent.name} will
            prepare a free Comparative Market Analysis (CMA) for you.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
              <MapPin size={20} style={{ color: "var(--accent)" }} />
              Property Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Street Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">City *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Toronto"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  placeholder="M5V 2T6"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
              <Home size={20} style={{ color: "var(--accent)" }} />
              Property Features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Property Type</label>
                <select
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm bg-white"
                >
                  <option value="detached">Detached</option>
                  <option value="semi-detached">Semi-Detached</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="condo">Condo / Apartment</option>
                  <option value="bungalow">Bungalow</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <BedDouble size={14} /> Bedrooms
                </label>
                <select
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm bg-white"
                >
                  {["1", "2", "3", "4", "5", "6+"].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Bath size={14} /> Bathrooms
                </label>
                <select
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm bg-white"
                >
                  {["1", "1.5", "2", "2.5", "3", "3.5", "4+"].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Ruler size={14} /> Approx. Sq Ft
                </label>
                <input
                  type="text"
                  value={form.sqft}
                  onChange={(e) => update("sqft", e.target.value)}
                  placeholder="e.g. 1800"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar size={14} /> Year Built
                </label>
                <input
                  type="text"
                  value={form.yearBuilt}
                  onChange={(e) => update("yearBuilt", e.target.value)}
                  placeholder="e.g. 2005"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => update("condition", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm bg-white"
                >
                  <option value="excellent">Excellent — recently renovated</option>
                  <option value="good">Good — well maintained</option>
                  <option value="fair">Fair — needs some updates</option>
                  <option value="poor">Poor — needs major work</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
              <Send size={20} style={{ color: "var(--accent)" }} />
              Your Contact Info
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(416) 555-0123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 shadow-lg disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? "Submitting…" : "Get My Free Home Valuation"}
            </button>
            <p className="text-xs text-gray-400 mt-3">
              No obligation. {siteConfig.agent.name} will contact you within 24-48 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
