import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Our Services | Konark Industry",
  description: "AC repair, EV charger installation, solar setup, battery service and more. Doorstep service across Odisha.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
