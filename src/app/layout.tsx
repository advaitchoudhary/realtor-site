import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: {
    default: siteConfig.site.name,
    template: `%s | ${siteConfig.site.name}`,
  },
  description: `${siteConfig.agent.name} — ${siteConfig.agent.title}. Find your dream home today.`,
  openGraph: {
    title: siteConfig.site.name,
    description: `${siteConfig.agent.name} — ${siteConfig.agent.title}`,
    url: siteConfig.site.url,
    siteName: siteConfig.site.name,
    images: [{ url: siteConfig.site.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style>{`
          :root {
            --primary: ${siteConfig.theme.primary};
            --accent: ${siteConfig.theme.accent};
            --secondary: ${siteConfig.theme.secondary};
            --text: ${siteConfig.theme.text};
          }
        `}</style>
      </head>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
