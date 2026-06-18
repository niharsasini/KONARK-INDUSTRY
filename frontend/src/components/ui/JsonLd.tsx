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
    id?: string | number;
    name: string;
    description?: string;
    images?: string[];
    image?: string;
    price?: number;
    in_stock?: boolean;
    inStock?: boolean;
    rating?: number;
    review_count?: number;
    slug?: string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const toAbsolute = (img: string) =>
    img.startsWith("http") ? img : `https://www.konarkindustry.com${img}`;

  const images = product.images?.length
    ? product.images.map(toAbsolute)
    : product.image
      ? [toAbsolute(product.image)]
      : [];

  const inStock = product.in_stock ?? product.inStock ?? true;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: images,
    brand: { "@type": "Brand", name: "Konark Industry" },
    manufacturer: {
      "@type": "Organization",
      name: "Konark Industry",
      url: "https://www.konarkindustry.com",
    },
    sku: product.slug || "",
    mpn: product.id !== undefined ? String(product.id) : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price || 0,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Konark Industry" },
      url: `https://www.konarkindustry.com/products/${product.slug || ""}`,
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.review_count || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  // Strip undefined keys so they don't render as "undefined" in the JSON
  const clean = JSON.parse(JSON.stringify(data));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  );
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `https://www.konarkindustry.com${item.href}` : undefined,
    })),
  };

  const clean = JSON.parse(JSON.stringify(data));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  );
}
