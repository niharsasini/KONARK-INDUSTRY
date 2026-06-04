export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Konark Industry",
    description: "EV scooter, battery, and home appliance manufacturer in Bhubaneswar, Odisha",
    url: "https://www.konarkindustry.com",
    telephone: "+919437611129",
    email: "konarkindustrie@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bhimatangi Housing Colony",
      addressLocality: "Bhubaneswar",
      addressRegion: "Odisha",
      postalCode: "751002",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.2961,
      longitude: 85.8245,
    },
    openingHours: "Mo-Sa 09:00-18:00",
    sameAs: ["https://www.startupindia.gov.in"],
    priceRange: "₹₹",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  product: {
    name: string;
    description?: string;
    images?: string[];
    image?: string;
    price?: number;
    in_stock?: boolean;
    rating?: number;
    review_count?: number;
    slug?: string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.images?.[0] || product.image || "",
    brand: { "@type": "Brand", name: "Konark Industry" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price || 0,
      availability: product.in_stock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Konark Industry" },
      url: `https://www.konarkindustry.com/products/${product.slug || ""}`,
    },
  };

  if (product.rating) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.review_count || 1,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
