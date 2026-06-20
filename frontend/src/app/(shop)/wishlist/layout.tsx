import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Wishlist | Konark Industry",
  description: "Your saved products from Konark Industry.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
