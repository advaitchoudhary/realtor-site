"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Listings",
    href: "/listings",
    children: [
      { label: "Buy a Home", href: "/listings?type=Sale" },
      { label: "Rent a Home", href: "/listings?type=Lease" },
      { label: "New Construction", href: "/listings?new=true" },
    ],
  },
  { label: "Map Search", href: "/listings/map" },
  { label: "Neighbourhoods", href: "/neighbourhoods" },
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
      { label: "Affordability Calculator", href: "/tools/affordability-calculator" },
      { label: "Land Transfer Tax", href: "/tools/land-transfer-tax" },
      { label: "Home Value Estimator", href: "/tools/home-value-estimator" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = !isHome || scrolled
    ? "bg-white shadow-md"
    : "bg-transparent";

  const textColor = !isHome || scrolled ? "text-gray-800" : "text-white";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-visible",
          navBg
        )}
      >
        {/* Top bar */}
        {(!isHome || scrolled) && (
          <div className="hidden lg:flex items-center justify-end gap-6 px-8 py-1.5 text-xs border-b border-gray-100 bg-[var(--primary)] text-white">
            <a href={`tel:${siteConfig.agent.phone}`} className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors">
              <Phone size={12} />
              {siteConfig.agent.phone}
            </a>
            <a href={`mailto:${siteConfig.agent.email}`} className="hover:text-[var(--accent)] transition-colors">
              {siteConfig.agent.email}
            </a>
          </div>
        )}

        <div className={cn("flex items-center justify-between px-6 lg:px-10 transition-all duration-300 overflow-visible", isHome && !scrolled ? "h-28 lg:h-32" : "h-16 lg:h-20")}>
          {/* Agent headshot */}
          <Link href="/" className="flex items-center gap-3">
            {/* Placeholder keeps flex layout stable; image overflows below */}
            <div
              className={cn(
                "relative shrink-0 transition-all duration-300",
                isHome && !scrolled ? "h-24 w-36 lg:h-28 lg:w-44" : "h-10 w-10 lg:h-12 lg:w-12"
              )}
            >
              <div
                className={cn(
                  "absolute top-0 left-0 rounded-full overflow-hidden border-2 shadow-sm transition-all duration-300",
                  isHome && !scrolled ? "h-36 w-36 lg:h-44 lg:w-44" : "h-full w-full"
                )}
                style={{ borderColor: "var(--accent)" }}
              >
                <img
                  src={siteConfig.agent.photo}
                  alt={siteConfig.agent.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            {/* Divider */}
            <div
              className="hidden sm:block h-9 w-px shrink-0"
              style={{ background: (!isHome || scrolled) ? "#e5e7eb" : "rgba(255,255,255,0.35)" }}
            />
            {/* Name + credential */}
            <div className="hidden sm:flex flex-col leading-tight">
              <span className={cn("font-bold tracking-tight transition-all duration-300", textColor, isHome && !scrolled ? "text-xl lg:text-2xl" : "text-sm")}>
                {siteConfig.agent.name}
              </span>
              <span className={cn("font-semibold tracking-widest uppercase transition-all duration-300", isHome && !scrolled ? "text-xs" : "text-[10px]")} style={{ color: "var(--accent)" }}>
                REALTOR® · {siteConfig.agent.license}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.href)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      textColor,
                      "hover:text-[var(--accent)]"
                    )}
                  >
                    {link.label}
                    <ChevronDown size={14} className={cn("transition-transform", dropdown === link.href && "rotate-180")} />
                  </button>
                  {dropdown === link.href && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slideDown">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    textColor,
                    "hover:text-[var(--accent)]",
                    pathname === link.href && "text-[var(--accent)]"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 text-sm font-semibold rounded-full text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "var(--accent)" }}
            >
              Contact
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn("lg:hidden p-2 rounded-lg transition-colors", textColor)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: "var(--accent)" }}>
                  <img src={siteConfig.agent.photo} alt={siteConfig.agent.name} className="h-10 w-10 object-cover object-top" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-[var(--primary)]">{siteConfig.agent.name}</span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>REALTOR® · {siteConfig.agent.license}</span>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-3 font-medium text-gray-800 hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block pl-10 pr-6 py-2.5 text-sm text-gray-600 hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="p-6 border-t space-y-3">
              <a href={`tel:${siteConfig.agent.phone}`} className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} style={{ color: "var(--primary)" }} />
                {siteConfig.agent.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full py-3 text-center text-white font-semibold rounded-full transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
