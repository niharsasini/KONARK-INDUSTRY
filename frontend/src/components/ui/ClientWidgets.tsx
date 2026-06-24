"use client";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });
const BackToTop = dynamic(() => import("./BackToTop"), { ssr: false });
const CookieConsent = dynamic(() => import("./CookieConsent"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text-heading)",
            border: "1px solid var(--border-light)",
            borderRadius: "10px",
            fontSize: "13px",
          },
          success: {
            iconTheme: { primary: "var(--navy)", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <WhatsAppButton />
      <BackToTop />
      <CookieConsent />
    </>
  );
}
