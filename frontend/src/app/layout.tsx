import "./globals.css";
import NavbarV2 from "@/components/layout/NavbarV2";
import Footer from "@/components/layout/Footer";
import ClientAuthModal from "@/components/ui/ClientAuthModal";
import ClientWidgets from "@/components/ui/ClientWidgets";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import { PageTransition } from "@/components/ui/PageTransition";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
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
      { url: "/konark/og-logo.png", width: 1200, height: 630, alt: "Konark Industry – Odisha's EV & Energy Brand" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konark Industry",
    description: "Odisha's leading manufacturer of EVs, batteries, home appliances, and industrial solutions.",
    images: ["/konark/og-logo.png"],
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
        <ScrollProgress />
        <AnnouncementBanner />
        <NavbarV2 />
        <PageTransition>
          <main style={{ flex: 1 }}>{children}</main>
        </PageTransition>
        <Footer />
        <ClientAuthModal />
        <ClientWidgets />
      </body>
    </html>
  );
}
