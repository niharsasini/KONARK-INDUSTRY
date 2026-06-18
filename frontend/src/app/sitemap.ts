import { MetadataRoute } from "next";
import { products } from "@/components/product/ProductData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.konarkindustry.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, priority: 1.0, changeFrequency: "daily", lastModified: now },
    { url: `${base}/products`, priority: 0.9, changeFrequency: "daily", lastModified: now },
    { url: `${base}/services`, priority: 0.8, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/battery-swap`, priority: 0.8, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/test-ride`, priority: 0.8, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/about`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/contact`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/partner`, priority: 0.6, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/services/enquiry`, priority: 0.7, changeFrequency: "weekly", lastModified: now },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    priority: product.isNew ? 0.85 : 0.7,
    changeFrequency: "weekly",
    lastModified: now,
  }));

  return [...staticPages, ...productPages];
}
