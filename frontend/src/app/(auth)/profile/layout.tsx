import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Profile | Konark Industry",
  description: "Manage your Konark Industry account details and order history.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
