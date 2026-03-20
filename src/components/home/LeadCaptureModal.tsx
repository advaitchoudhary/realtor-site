"use client";

import { useEffect, useState } from "react";
import { X, User, Mail, Phone, MapPin, DollarSign, Clock, CheckCircle, Instagram, Loader2, Home } from "lucide-react";
import { siteConfig } from "@/lib/config";

const STORAGE_KEY = "lead_modal_dismissed";

const INTENT_OPTIONS = ["Buy", "Sell", "Rent", "Invest"] as const;
const BUDGET_OPTIONS = [
  "Under $500K",
  "$500K – $800K",
  "$800K – $1.2M",
  "$1.2M – $2M",
  "$2M+",
  "Not sure yet",
];
const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "6+ months",
  "Just browsing",
];
const PREAPPROVAL_OPTIONS = ["Yes", "No", "In progress"];

type Intent = (typeof INTENT_OPTIONS)[number];

export default function LeadCaptureModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    intent: "" as Intent | "",
    area: "",
    budget: "",
    timeline: "",
    preApproved: "",
    note: "",
  });

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
  }, []);

  function dismiss() {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.intent) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);

    const messageParts = [
      `Intent: ${form.intent}`,
      form.area && `Preferred area: ${form.area}`,
      form.budget && `Budget: ${form.budget}`,
      form.timeline && `Timeline: ${form.timeline}`,
      form.intent === "Buy" && form.preApproved && `Pre-approved: ${form.preApproved}`,
      form.note && `Additional notes: ${form.note}`,
    ].filter(Boolean);

    const type = form.intent === "Buy" || form.intent === "Invest" ? "buyer" : "general";

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: messageParts.join("\n"),
          type,
          source: "other",
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const instagramUrl = siteConfig.social.instagram || "https://www.instagram.com/realtor.manojchaudhary/";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative px-7 pt-7 pb-5 shrink-0" style={{ background: "var(--primary)" }}>
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Let's Find Your Perfect Home</h2>
              <p className="text-white/70 text-xs">Free consultation — no obligation</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-7 py-5">
          {submitted ? (
            <div className="py-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--secondary)" }}
              >
                <CheckCircle size={32} style={{ color: "var(--primary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                You're all set!
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Thanks, {form.name.split(" ")[0]}! Manoj will reach out to you shortly.
              </p>

              {/* Instagram CTA */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}
              >
                <Instagram size={18} />
                Follow on Instagram for market updates
              </a>

              <button
                onClick={dismiss}
                className="block mx-auto mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Intent */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  I'm looking to <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {INTENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set("intent", opt)}
                      className="py-2 rounded-xl text-sm font-medium border-2 transition-all"
                      style={
                        form.intent === opt
                          ? { background: "var(--primary)", borderColor: "var(--primary)", color: "#fff" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="(416) 000-0000"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="jane@email.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Area + Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Preferred Area</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.area}
                      onChange={(e) => set("area", e.target.value)}
                      placeholder="Brampton, Mississauga…"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Budget Range</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={form.budget}
                      onChange={(e) => set("budget", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select…</option>
                      {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Timeline + Pre-approval */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Timeline</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={form.timeline}
                      onChange={(e) => set("timeline", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select…</option>
                      {TIMELINE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                {form.intent === "Buy" && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Pre-approved?</label>
                    <select
                      value={form.preApproved}
                      onChange={(e) => set("preApproved", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select…</option>
                      {PREAPPROVAL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Anything else? (optional)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => set("note", e.target.value)}
                  rows={2}
                  placeholder="Specific requirements, property type, number of bedrooms…"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--primary)" }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Get Free Consultation"}
              </button>

              {/* Instagram CTA */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-medium transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}
              >
                <Instagram size={15} />
                Follow on Instagram for market tips &amp; new listings
              </a>

              <p className="text-center text-[11px] text-gray-400">
                Your information is private and will never be shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
