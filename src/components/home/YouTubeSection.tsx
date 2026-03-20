import Link from "next/link";
import { Play, Youtube, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

// Add more video IDs here as needed
const videos = [
  {
    id: "XaVms6yb8QY",
    title: "Manoj Chaudhary Real Estate",
  },
];

const CHANNEL_URL = siteConfig.social.youtube || "https://www.youtube.com/@Realtor.ManojChaudhary";

export default function YouTubeSection() {
  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Watch &amp; Learn
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "var(--primary)" }}>
              Real Estate Insights
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Market tips, neighbourhood tours, and buying &amp; selling advice — straight from Manoj.
            </p>
          </div>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold hover:gap-3 transition-all"
            style={{ color: "var(--primary)" }}
          >
            View Channel <ArrowRight size={16} />
          </a>
        </div>

        <div className={`grid gap-6 ${rest.length > 0 ? "lg:grid-cols-3" : "max-w-3xl mx-auto"}`}>
          {/* Featured video — full embed */}
          <div className={rest.length > 0 ? "lg:col-span-2" : ""}>
            <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${featured.id}?rel=0&modestbranding=1`}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FF0000" }}>
                <Youtube size={14} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{featured.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{siteConfig.agent.name} · REALTOR®</p>
              </div>
            </div>
          </div>

          {/* Additional videos as thumbnail cards */}
          {rest.length > 0 && (
            <div className="flex flex-col gap-4">
              {rest.map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black shadow-sm">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={16} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {v.title}
                  </p>
                </a>
              ))}

              {/* Subscribe CTA */}
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold mt-auto transition-opacity hover:opacity-90"
                style={{ background: "#FF0000" }}
              >
                <Youtube size={18} />
                Subscribe on YouTube
              </a>
            </div>
          )}
        </div>

        {/* Subscribe CTA when only one video */}
        {rest.length === 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#FF0000" }}
            >
              <Youtube size={18} />
              Subscribe on YouTube
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border-2 transition-colors hover:bg-[var(--secondary)]"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            >
              Ask Manoj a Question <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Mobile channel link */}
        <div className="mt-6 text-center md:hidden">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "var(--primary)" }}
          >
            View Full Channel <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
