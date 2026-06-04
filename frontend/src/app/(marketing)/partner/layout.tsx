import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Partner With Us | Konark Industry",
  description: "Become a Konark distributor or installation partner. High margins, exclusive territory, full training provided.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
