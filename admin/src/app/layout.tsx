import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = { title: "Konark Admin Panel" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", background: "var(--bg-page)", color: "var(--text-heading)" }} suppressHydrationWarning>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-card)",
              color: "var(--text-heading)",
              border: "1px solid rgba(92,103,149,0.3)",
              borderRadius: "10px",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "var(--navy)", secondary: "#fff" } },
            error: { iconTheme: { primary: "var(--red)", secondary: "#fff" } },
          }}
        />
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
