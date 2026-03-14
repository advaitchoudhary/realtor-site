import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { Star, TrendingUp, Users, Trophy, Home } from "lucide-react";

export const metadata = { title: "About" };

const awards = [
  { icon: Trophy, label: "4× Centurion Award", desc: "Century 21's highest honour — four-time winner" },
  { icon: Home, label: "Pre-Construction Expert", desc: "Recognized as a top pre-construction specialist" },
  { icon: Users, label: "Client-First Approach", desc: "Dedicated to your goals from search to closing" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <div className="py-20 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-[600px] h-[600px] rounded-full bg-white absolute -right-48 -top-48" />
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>About</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-5">Meet {siteConfig.agent.name}</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              A dedicated REALTOR® with {siteConfig.agent.license}, Manoj Chaudhary is
              a 4-time Centurion Award winner and one of Brampton&apos;s most trusted real estate
              professionals — helping families buy, sell, and invest with confidence.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/contact" className="px-6 py-3 rounded-full font-semibold text-[var(--primary)] text-sm" style={{ background: "var(--accent)" }}>
                Contact Me
              </Link>
              <Link href="/listings" className="px-6 py-3 rounded-full font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all text-sm">
                View Listings
              </Link>
            </div>
          </div>
          <div className="relative max-w-sm mx-auto lg:mx-0">
            <div className="rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src={siteConfig.agent.photo}
                alt={siteConfig.agent.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16" style={{ background: "var(--secondary)" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "4×", label: "Centurion Award" },
            { value: "500+", label: "Homes Sold" },
            { value: "#1", label: "Pre-Construction" },
            { value: "C21", label: "Property Zone Realty" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold mb-1" style={{ color: "var(--primary)" }}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="py-16 max-w-5xl mx-auto px-6 lg:px-10">
        <h2 className="text-3xl font-bold text-[var(--primary)] mb-8">Awards & Recognition</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {awards.map((a) => (
            <div key={a.label} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--primary)" }}>
                <a.icon size={20} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-[var(--primary)]">{a.label}</div>
                <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="py-16 max-w-4xl mx-auto px-6 lg:px-10 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-[var(--primary)] mb-6">My Story</h2>
        <div className="prose text-gray-600 leading-relaxed space-y-4">
          <p>Real estate isn&apos;t just my profession — it&apos;s my passion. As a REALTOR® with {siteConfig.agent.license}, I have built my career on a foundation of trust, dedication, and results. Having earned the prestigious Centurion Award four times, I am proud to be recognized among the top-performing agents in the country.</p>
          <p>I specialize in both resale and pre-construction properties throughout the Greater Toronto Area and Brampton, helping buyers, sellers, and investors navigate the market with confidence. Whether you are a first-time buyer, upgrading your home, or building an investment portfolio, I bring the experience and local market knowledge to make it happen.</p>
          <p>My approach is simple: listen to what you need, work relentlessly to achieve it, and keep you informed every step of the way. I believe that buying or selling a home should be an exciting experience — and I am here to make sure it is.</p>
          <p>If you are ready to take the next step, I would love to connect. Reach out today and let&apos;s find your perfect home together.</p>
        </div>

        <div className="mt-10 p-6 rounded-2xl border-l-4 flex flex-col sm:flex-row sm:items-center gap-6" style={{ borderColor: "var(--accent)", background: "var(--secondary)" }}>
          <img src={siteConfig.agent.photo} alt={siteConfig.agent.name} className="w-20 h-20 rounded-full object-cover object-top shrink-0" />
          <div>
            <div className="font-bold text-[var(--primary)] text-lg">{siteConfig.agent.name}</div>
            <div className="text-sm text-gray-500">{siteConfig.agent.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">{siteConfig.agent.license}</div>
            <div className="flex gap-4 mt-3 text-sm">
              <a href={`tel:${siteConfig.agent.phone}`} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "var(--primary)" }}>
                {siteConfig.agent.phone}
              </a>
              <a href={`mailto:${siteConfig.agent.email}`} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "var(--accent)" }}>
                {siteConfig.agent.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
