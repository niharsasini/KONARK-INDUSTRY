import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Search Products | Konark Industry",
  description: "Search for EV scooters, batteries, fans, ACs and more from Konark Industry.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
