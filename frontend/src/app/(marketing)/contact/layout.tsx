import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Konark Industry",
  description: "Get in touch with Konark Industry. Call +91 94376 11129 or visit Bhimatangi Housing Colony, Bhubaneswar.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
