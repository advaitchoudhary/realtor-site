import Link from "next/link";
import { MapPin, TrendingUp, Users, ArrowRight } from "lucide-react";
import { neighbourhoods } from "@/lib/neighbourhoods";

export const metadata = { title: "Neighbourhood Guides" };

export default function NeighbourhoodsPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <div className="py-20 text-white text-center relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
            Explore Ontario
          </p>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">Neighbourhood Guides</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            In-depth guides to the best communities in the GTA — schools, transit, lifestyle, and average prices.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {neighbourhoods.map((n) => (
            <Link key={n.slug} href={`/neighbourhoods/${n.slug}`} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={n.cardImage}
                    alt={n.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="font-bold text-xl text-white">{n.name}</div>
                    <div className="flex items-center gap-1 text-white/80 text-sm mt-0.5">
                      <MapPin size={12} />
                      {n.region}
                    </div>
                  </div>
                  <div
                    className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    Avg {n.avgPrice}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{n.tagline}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} style={{ color: "var(--primary)" }} />
                      {n.population}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} style={{ color: "var(--primary)" }} />
                      {n.stats.find((s) => s.label === "Price Growth (1yr)")?.value} growth
                    </span>
                  </div>

                  {/* Lifestyle tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {n.lifestyle.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "var(--secondary)", color: "var(--primary)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                    style={{ color: "var(--primary)" }}
                  >
                    View Full Guide <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--primary)" }}>
            Not sure which neighbourhood is right for you?
          </h2>
          <p className="text-gray-500 mb-6">
            Book a free consultation with Manoj and get personalized recommendations based on your budget and lifestyle.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
