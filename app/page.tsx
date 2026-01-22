import Hero from "./components/Hero";
import PageComponent from "./components/page";

export default function Home() {
  return (
    <main className="overflow-hidden text-black">
      {/* Hero Section */}
      <section className="min-h-screen bg-[#964a22] flex items-center justify-center">
        <Hero />
      </section>

      {/* Next Page Section */}
      <section className="bg-white text-black py-16">
        <PageComponent />
      </section>
    </main>
  );
}
