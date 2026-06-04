import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Orders | Konark Industry",
  description: "Track and manage all your Konark Industry orders.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
