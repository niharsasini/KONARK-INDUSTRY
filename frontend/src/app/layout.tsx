import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientAuthModal from "@/components/ui/ClientAuthModal";
import ClientWidgets from "@/components/ui/ClientWidgets";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import { LocalBusinessJsonLd } from "@/components/ui/JsonLd";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Konark Industry", template: "%s | Konark Industry" },
  description:
    "Odisha's leading manufacturer of EVs, batteries, home appliances, and industrial solutions. Based in Bhubaneswar.",
  openGraph: {
    siteName: "Konark Industry",
    locale: "en_IN",
    type: "website",
    images: [
      { url: "/konark/og-image.png", width: 1200, height: 630, alt: "Konark Industry – Odisha's EV & Energy Brand" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konark Industry",
    description: "Odisha's leading manufacturer of EVs, batteries, home appliances, and industrial solutions.",
    images: ["/konark/og-image.png"],
  },
  keywords: [
    "electric vehicle",
    "EV scooter",
    "battery",
    "solar",
    "Bhubaneswar",
    "Odisha",
    "Konark",
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AnnouncementBanner />
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <ClientAuthModal />
        <ClientWidgets />
      </body>
    </html>
  );
}
