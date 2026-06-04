import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In | Konark Industry",
  description: "Sign in to your Konark Industry account to track orders and manage service bookings.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
