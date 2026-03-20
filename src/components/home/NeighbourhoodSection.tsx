import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { neighbourhoods } from "@/lib/neighbourhoods";

export default function NeighbourhoodSection() {
  const featured = neighbourhoods.slice(0, 4);

  return (
    <section className="py-20" style={{ background: "var(--secondary)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Explore
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "var(--primary)" }}>
              Neighbourhood Guides
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              In-depth guides to schools, transit, lifestyle and average prices across the GTA.
            </p>
          </div>
          <Link
            href="/neighbourhoods"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold hover:gap-3 transition-all"
            style={{ color: "var(--primary)" }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((n) => (
            <Link key={n.slug} href={`/neighbourhoods/${n.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-sm">
                <img
                  src={n.cardImage}
                  alt={n.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: "var(--accent)", color: "var(--primary)" }}
                  >
                    Avg {n.avgPrice}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <MapPin size={11} />
                    {n.region}
                  </div>
                  <div className="font-bold text-xl text-white mb-1">{n.name}</div>
                  <div className="text-white/70 text-xs line-clamp-2 mb-3">{n.tagline}</div>
                  <div
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all group-hover:gap-2"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                  >
                    View Guide <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/neighbourhoods"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            View All Neighbourhoods <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
