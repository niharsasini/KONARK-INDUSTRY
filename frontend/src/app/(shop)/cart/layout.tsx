import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Cart | Konark Industry",
  description: "Review your cart and proceed to checkout.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
