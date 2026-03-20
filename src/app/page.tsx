import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturedListings from "@/components/home/FeaturedListings";
import AgentSection from "@/components/home/AgentSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import YouTubeSection from "@/components/home/YouTubeSection";
import LeadCaptureModal from "@/components/home/LeadCaptureModal";
import NeighbourhoodSection from "@/components/home/NeighbourhoodSection";

export default function HomePage() {
  return (
    <>
      <LeadCaptureModal />
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <NeighbourhoodSection />
      <YouTubeSection />
      <AgentSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
