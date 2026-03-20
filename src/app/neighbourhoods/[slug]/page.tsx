import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, TrendingUp, Users, Train, GraduationCap, CheckCircle, ArrowRight, ChevronLeft, Star } from "lucide-react";
import { getNeighbourhood, neighbourhoods } from "@/lib/neighbourhoods";

export function generateStaticParams() {
  return neighbourhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNeighbourhood(slug);
  if (!n) return {};
  return {
    title: `${n.name} Neighbourhood Guide`,
    description: n.tagline,
  };
}

export default async function NeighbourhoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNeighbourhood(slug);
  if (!n) notFound();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end">
        <img src={n.heroImage} alt={n.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-10">
          <Link
            href="/neighbourhoods"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ChevronLeft size={16} /> All Neighbourhoods
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{n.region}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3">{n.name}</h1>
          <p className="text-white/80 text-lg max-w-2xl">{n.tagline}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {n.stats.map((stat) => (
              <div key={stat.label} className="py-5 px-6 text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>About {n.name}</h2>
              <p className="text-gray-600 leading-relaxed text-base">{n.description}</p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>Why {n.name}?</h2>
              <div className="space-y-3">
                {n.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                    <span className="text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Schools */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={22} style={{ color: "var(--primary)" }} />
                <h2 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>Top Schools</h2>
              </div>
              <div className="space-y-3">
                {n.schools.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{s.type}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                      <Star size={12} fill="currentColor" />
                      {s.rating}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Transit */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Train size={22} style={{ color: "var(--primary)" }} />
                <h2 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>Getting Around</h2>
              </div>
              <div className="space-y-2.5">
                {n.transit.map((t) => (
                  <div key={t} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-gray-100">
                    <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: "var(--accent)" }} />
                    <span className="text-gray-700 text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Pros */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>What Buyers Love</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {n.pros.map((p) => (
                  <div key={p} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-700">
                    ✦ {p}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scores */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: "var(--primary)" }}>Neighbourhood Scores</h3>
              {[
                { label: "Walk Score", value: n.walkScore },
                { label: "Transit Score", value: n.transitScore },
              ].map((s) => (
                <div key={s.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{s.label}</span>
                    <span className="font-bold" style={{ color: "var(--primary)" }}>{s.value}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${s.value}%`, background: "var(--primary)" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: "var(--primary)" }}>Ideal For</h3>
              <div className="flex flex-wrap gap-2">
                {n.lifestyle.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm font-medium px-3 py-1.5 rounded-full"
                    style={{ background: "var(--secondary)", color: "var(--primary)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3" style={{ color: "var(--primary)" }}>Price Range</h3>
              <div className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>{n.avgPrice}</div>
              <div className="text-sm text-gray-500">Average · Range: {n.priceRange}</div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-white" style={{ background: "var(--primary)" }}>
              <Users size={24} className="mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-2">Interested in {n.name}?</h3>
              <p className="text-white/70 text-sm mb-4">
                Let Manoj help you find the right home in this neighbourhood.
              </p>
              <Link
                href={`/listings?city=${encodeURIComponent(n.city)}&type=Sale`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm mb-3 transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)", color: "var(--primary)" }}
              >
                View Listings <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
