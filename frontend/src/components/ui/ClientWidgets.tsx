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
            background: "#0c1525",
            color: "#f1f5f9",
            border: "1px solid #1c3050",
            borderRadius: "10px",
            fontSize: "13px",
          },
          success: {
            iconTheme: { primary: "#38bdf8", secondary: "#080f1e" },
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
