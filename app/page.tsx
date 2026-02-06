import Hero from "./components/hero/Hero.jsx";
import PageComponent from "./components/solutions/Solutions.jsx";
import People from "./components/testimonials/Testimonials.jsx";
import OurPartner from "./components/partners/OurPartners.jsx";
export default function Home() {
  return (
    <main className="overflow-x-hidden text-black">
      {/* Hero Section */}
      <section className="bg-[#964a22]">
        <Hero />
      </section>

      {/* Main Content */}
      <section className="bg-white">
        <PageComponent />
      </section>

      {/* Client Testimonials */}
      <section className="bg-black">
        <People />
      </section>

      {/* Client Testimonials */}
      <section className="bg-black">
        <OurPartner />
      </section>
    </main>
  );
}
