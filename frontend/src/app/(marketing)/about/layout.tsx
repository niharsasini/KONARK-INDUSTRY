import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Us | Konark Industry",
  description: "Learn about Konark Industry — Odisha's leading EV, battery and home appliance manufacturer based in Bhubaneswar since 2014.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
