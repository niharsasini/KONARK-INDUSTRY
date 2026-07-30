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
import { SectionCover } from "@/components/ui/SectionCover";
import { SectionDots } from "@/components/ui/SectionDots";

export const metadata: Metadata = {
  title: "Konark Industry — Power Your World | EVs, Batteries & Services, Odisha",
  description:
    "Konark Industry makes EV scooters, e-rickshaws, LFP batteries, BLDC fans, and ACs in Bhubaneswar. We also fix your AC, EV charger, and wiring at your doorstep across Odisha.",
};

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg-page)" }}>
      <SectionDots />

      <Hero />

      <SectionCover>
        <MarqueeStrip />
      </SectionCover>

      <SectionCover id="stats" background="#F5F7FF" roundedTop>
        <StatsSection />
      </SectionCover>

      <SectionCover id="products" background="#EEF2FF" roundedTop>
        <FeaturedProducts />
      </SectionCover>

      <SectionCover id="services" background="#F0F5FF" roundedTop>
        <ServicesPreview />
      </SectionCover>

      <SectionCover id="why" background="#0B1729" roundedTop>
        <WhyKonark />
      </SectionCover>

      <SectionCover>
        <CertificationsSection />
      </SectionCover>

      <SectionCover background="#F5F7FF" roundedTop>
        <SolutionsSection />
      </SectionCover>

      <SectionCover id="testimonials" background="#EEF2FF" roundedTop>
        <Testimonials />
      </SectionCover>

      <SectionCover>
        <OurPartners />
      </SectionCover>

      <SectionCover background="#FFFFFF" roundedTop>
        <NewsletterSection />
      </SectionCover>

      <SectionCover background="#0B1729" roundedTop>
        <CTABanner />
      </SectionCover>
    </main>
  );
}
