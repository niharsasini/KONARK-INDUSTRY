import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "All Products | Konark Industry",
  description: "Browse our full range of products — EV scooters, e-rickshaws, LFP batteries, BLDC fans, ACs, and solar inverters.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
