import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Track Battery Swap | Konark Industry",
  description: "Track the status of your battery swap request using your BSW token number.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
