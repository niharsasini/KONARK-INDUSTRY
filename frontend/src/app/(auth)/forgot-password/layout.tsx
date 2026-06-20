import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Forgot Password | Konark Industry",
  description: "Reset your Konark Industry account password.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
