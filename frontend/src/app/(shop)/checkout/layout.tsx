import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Checkout | Konark Industry",
  description: "Complete your order securely.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
