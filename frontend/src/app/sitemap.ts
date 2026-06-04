import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.konarkindustry.com";
  return [
    { url: base, priority: 1.0, changeFrequency: "daily", lastModified: new Date() },
    { url: `${base}/products`, priority: 0.9, changeFrequency: "daily", lastModified: new Date() },
    { url: `${base}/services`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/battery-swap`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/test-ride`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/about`, priority: 0.7, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/contact`, priority: 0.7, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/partner`, priority: 0.6, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/services/enquiry`, priority: 0.7, changeFrequency: "weekly", lastModified: new Date() },
  ];
}
