import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturedListings from "@/components/home/FeaturedListings";
import CitySearch from "@/components/home/CitySearch";
import AgentSection from "@/components/home/AgentSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <CitySearch />
      <AgentSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
