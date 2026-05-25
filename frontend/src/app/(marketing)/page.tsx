import type { Metadata } from "next";
import Hero from "@/components/sections/hero/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import WhyKonark from "@/components/sections/WhyKonark";
import SolutionsSection from "@/components/sections/SolutionsSection";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import OurPartners from "@/components/sections/partners/OurPartners";
import CTABanner from "@/components/sections/CTABanner";

export const metadata: Metadata = { title: "Power Your World" };

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <StatsSection />
      <FeaturedProducts />
      <WhyKonark />
      <SolutionsSection />
      <Testimonials />
      <OurPartners />
      <CTABanner />
    </main>
  );
}
