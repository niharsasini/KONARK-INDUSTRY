import type { Metadata } from "next";
import Hero from "@/components/sections/hero/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ServicesPreview from "@/components/sections/ServicesPreview";
import WhyKonark from "@/components/sections/WhyKonark";
import CertificationsSection from "@/components/sections/CertificationsSection";
import SolutionsSection from "@/components/sections/SolutionsSection";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import OurPartners from "@/components/sections/partners/OurPartners";
import NewsletterSection from "@/components/sections/NewsletterSection";
import CTABanner from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Konark Industry — Power Your World | EVs, Batteries & Services, Odisha",
  description:
    "Konark Industry makes EV scooters, e-rickshaws, LFP batteries, BLDC fans, and ACs in Bhubaneswar. We also fix your AC, EV charger, and wiring at your doorstep across Odisha.",
};

export default function HomePage() {
  return (
    <main style={{ background: "#0a0f1e" }}>
      <Hero />
      <MarqueeStrip />
      <StatsSection />
      <FeaturedProducts />
      <ServicesPreview />
      <WhyKonark />
      <CertificationsSection />
      <SolutionsSection />
      <Testimonials />
      <OurPartners />
      <NewsletterSection />
      <CTABanner />
    </main>
  );
}
