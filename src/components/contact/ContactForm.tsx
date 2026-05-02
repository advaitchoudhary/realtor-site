"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  compact?: boolean;
  defaultMessage?: string;
  listingId?: string;
  listingAddress?: string;
  listingPrice?: number;
  type?: "general" | "listing" | "valuation" | "buyer";
  source?: "contact" | "listing" | "home-value" | "mortgage" | "affordability" | "land-transfer-tax" | "other";
}

export default function ContactForm({ compact, defaultMessage, listingId, listingAddress, listingPrice, type = "listing", source }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage ?? "",
    type: listingId ? "listing" : type,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          listingId,
          listingAddress,
          listingPrice,
          source: source ?? (listingId ? "listing" : "contact"),
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("text-center", compact ? "py-6" : "py-12")}>
        <CheckCircle size={40} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
        <h3 className="font-bold text-gray-900 mb-1">Message Sent!</h3>
        <p className="text-sm text-gray-500">We&apos;ll be in touch with you shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs text-[var(--primary)] underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Full Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={cn(
            "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ring-[var(--primary)] focus:border-transparent",
            errors.name ? "border-red-400" : "border-gray-200"
          )}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email Address *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={cn(
            "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ring-[var(--primary)] focus:border-transparent",
            errors.email ? "border-red-400" : "border-gray-200"
          )}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:ring-2 ring-[var(--primary)] focus:border-transparent"
        />
      </div>

      {!compact && (
        <div>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "general" | "listing" | "valuation" | "buyer" })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:ring-2 ring-[var(--primary)] focus:border-transparent text-gray-700"
          >
            <option value="general">General Inquiry</option>
            <option value="buyer">I want to buy a home</option>
            <option value="valuation">Property Valuation</option>
            <option value="listing">Specific Listing</option>
          </select>
        </div>
      )}

      <div>
        <textarea
          placeholder="Your message *"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={compact ? 3 : 5}
          className={cn(
            "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ring-[var(--primary)] focus:border-transparent resize-none",
            errors.message ? "border-red-400" : "border-gray-200"
          )}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        By submitting this form, you consent to us contacting you about our real estate services. Your information is handled in accordance with our{" "}
        <Link href="/privacy" className="underline hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>.
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "var(--primary)" }}
      >
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-xs text-center text-red-500">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
