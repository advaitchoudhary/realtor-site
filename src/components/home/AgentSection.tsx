import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Star, TrendingUp, Trophy, Home } from "lucide-react";

const highlights = [
  { icon: Trophy, label: "4× Centurion Award", desc: "Century 21's most prestigious honour — four-time winner" },
  { icon: Home, label: "Pre-Construction Expert", desc: "Recognized as a leading pre-construction specialist" },
  { icon: TrendingUp, label: "Market Expert", desc: "Deep knowledge of GTA and Brampton market trends" },
];

export default function AgentSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <img
                src={siteConfig.agent.photo}
                alt={siteConfig.agent.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="font-bold text-[var(--primary)] text-lg">{siteConfig.agent.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">{siteConfig.agent.title}</div>
                <div className="text-xs text-gray-400 mt-1">{siteConfig.agent.license}</div>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent)" stroke="none" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4× Centurion Award</span>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div
              className="absolute -top-6 -left-6 w-40 h-40 rounded-full opacity-10 -z-10"
              style={{ background: "var(--primary)" }}
            />
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 -z-10"
              style={{ background: "var(--accent)" }}
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              Your trusted partner
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-5">
              Meet {siteConfig.agent.name}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A 4-time Centurion Award winner and one of Brampton&apos;s most trusted REALTORS®,
              Manoj Chaudhary brings unparalleled expertise in both resale and pre-construction
              properties across the Greater Toronto Area.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you&apos;re buying your first home, upgrading, or building an investment
              portfolio — Manoj is dedicated to getting you the best possible outcome.
              Real estate isn&apos;t just his profession — it&apos;s his passion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "var(--secondary)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--primary)" }}>
                    <h.icon size={17} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--primary)]">{h.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "var(--primary)" }}
              >
                Book a Consultation
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all hover:bg-[var(--secondary)]"
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
