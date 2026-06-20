import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reset Password | Konark Industry",
  description: "Set a new password for your Konark Industry account.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
