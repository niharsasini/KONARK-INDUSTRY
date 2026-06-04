import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Battery Swap Service | Konark Industry",
  description: "Swap your discharged EV battery for a fully charged one. Home pickup available. Book your swap and get a token instantly.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
