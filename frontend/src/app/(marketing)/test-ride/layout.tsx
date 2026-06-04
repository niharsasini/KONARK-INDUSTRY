import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book a Test Ride | Konark Industry",
  description: "Book a free test ride of the Konark EV Scooter X1 at our Bhubaneswar showroom. No commitment, just drive.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
