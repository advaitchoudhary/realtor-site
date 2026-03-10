import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <span className="text-2xl font-bold">{siteConfig.site.name}</span>
            <div className="h-0.5 w-10 mt-2" style={{ background: "var(--accent)" }} />
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            {siteConfig.agent.name} — {siteConfig.agent.title}.
            Helping clients find their perfect home with expertise,
            integrity and dedication.
          </p>
          <div className="flex gap-3">
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-[var(--accent)] transition-colors">
                <Facebook size={16} />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-[var(--accent)] transition-colors">
                <Instagram size={16} />
              </a>
            )}
            {siteConfig.social.twitter && (
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-[var(--accent)] transition-colors">
                <Twitter size={16} />
              </a>
            )}
            {siteConfig.social.linkedin && (
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-[var(--accent)] transition-colors">
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              { label: "Buy a Home", href: "/listings?type=Sale" },
              { label: "Rent a Home", href: "/listings?type=Lease" },
              { label: "Map Search", href: "/listings/map" },
              { label: "Neighbourhoods", href: "/neighbourhoods" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent)]">›</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Property Types */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Property Types
          </h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              { label: "Detached Houses", href: "/listings?propertyType=detached" },
              { label: "Semi-Detached", href: "/listings?propertyType=semidetached" },
              { label: "Condos & Apartments", href: "/listings?propertyType=condo" },
              { label: "Townhouses", href: "/listings?propertyType=townhomes" },
              { label: "Luxury Homes", href: "/listings?priceMin=1500000" },
              { label: "New Construction", href: "/listings?new=true" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                  <span style={{ color: "var(--accent)" }}>›</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Contact Us
          </h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li>
              <a href={`tel:${siteConfig.agent.phone}`} className="flex items-start gap-3 hover:text-[var(--accent)] transition-colors">
                <Phone size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                {siteConfig.agent.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.agent.email}`} className="flex items-start gap-3 hover:text-[var(--accent)] transition-colors">
                <Mail size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                {siteConfig.agent.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
              <div>
                <div>{siteConfig.agent.address}</div>
                <div className="text-white/50 mt-0.5">{siteConfig.agent.license}</div>
              </div>
            </li>
          </ul>
          <Link
            href="/contact"
            className="inline-block mt-6 px-5 py-2.5 rounded-full text-sm font-semibold text-[var(--primary)] hover:opacity-90 transition-opacity"
            style={{ background: "var(--accent)" }}
          >
            Request a Quote
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {siteConfig.site.name}. All rights reserved.</p>
          <p>{siteConfig.agent.license}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
