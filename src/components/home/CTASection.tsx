import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Phone, Mail } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: "var(--primary)" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-5 bg-white" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-5 bg-white" />

      <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
          Ready to make a move?
        </p>
        <h2 className="text-3xl lg:text-5xl font-bold mb-5">
          Let&apos;s Find Your Dream Home
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
          Whether you&apos;re buying, selling or just exploring — I&apos;m here to help.
          Get a free consultation today with no obligation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full font-bold text-[var(--primary)] transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "var(--accent)" }}
          >
            Contact
          </Link>
          <a
            href={`tel:${siteConfig.agent.phone}`}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white border-2 border-white/30 hover:border-white/60 transition-all"
          >
            <Phone size={18} />
            {siteConfig.agent.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
