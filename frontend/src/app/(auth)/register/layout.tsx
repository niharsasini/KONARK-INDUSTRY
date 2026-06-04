import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create Account | Konark Industry",
  description: "Join 25,000+ Konark customers. Create a free account to track orders, save wishlists, and get member prices.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
