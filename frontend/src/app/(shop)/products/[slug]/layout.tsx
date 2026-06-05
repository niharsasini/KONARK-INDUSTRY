import type { Metadata } from "next";
import { products } from "@/components/product/ProductData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description =
    (product.description || "").slice(0, 160) ||
    `${product.name} – ${product.category} by Konark Industry, Bhubaneswar`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Konark Industry`,
      description,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Konark Industry`,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return <>{children}</>;
}
