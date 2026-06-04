import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book a Service | Konark Industry",
  description: "Book a service visit. AC repair, EV charger install, home electrical, solar installation across Odisha.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
