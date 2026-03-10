export const siteConfig = {
  agent: {
    name: process.env.NEXT_PUBLIC_AGENT_NAME ?? "Your Agent Name",
    title: process.env.NEXT_PUBLIC_AGENT_TITLE ?? "Real Estate Specialist",
    phone: process.env.NEXT_PUBLIC_AGENT_PHONE ?? "(416) 555-0100",
    email: process.env.NEXT_PUBLIC_AGENT_EMAIL ?? "agent@realty.ca",
    license: process.env.NEXT_PUBLIC_AGENT_LICENSE ?? "Brokerage Name",
    address: process.env.NEXT_PUBLIC_AGENT_ADDRESS ?? "25 Van Kirk Dr. Unit 1, Brampton, ON L7A1A4",
    photo: process.env.NEXT_PUBLIC_AGENT_PHOTO ?? "/images/agent.jpg",
  },
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Realty Pro",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://realtypro.ca",
    logo: process.env.NEXT_PUBLIC_LOGO ?? "/images/logo.png",
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE ?? "/images/og.jpg",
  },
  theme: {
    primary: process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? "#1a3c5e",
    accent: process.env.NEXT_PUBLIC_ACCENT_COLOR ?? "#c9a84c",
    secondary: process.env.NEXT_PUBLIC_SECONDARY_COLOR ?? "#f8f5f0",
    text: process.env.NEXT_PUBLIC_TEXT_COLOR ?? "#1a1a1a",
  },
  images: {
    hero: process.env.NEXT_PUBLIC_HERO_IMAGE ?? "/images/hero.jpg",
    carousel: (process.env.NEXT_PUBLIC_CAROUSEL_IMAGES ?? "/images/carousel1.jpg,/images/carousel2.jpg,/images/carousel3.jpg").split(","),
  },
  api: {
    incomUrl: process.env.NEXT_PUBLIC_INCOM_API_URL ?? "https://api.ca.incomrealestate.com",
    defaultCity: process.env.NEXT_PUBLIC_DEFAULT_CITY ?? "Toronto",
    defaultProvince: process.env.NEXT_PUBLIC_DEFAULT_PROVINCE ?? "ON",
    defaultLat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? "43.718006"),
    defaultLng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? "-79.376246"),
    defaultZoom: parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM ?? "9"),
    googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  },
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  },
};

export type SiteConfig = typeof siteConfig;
