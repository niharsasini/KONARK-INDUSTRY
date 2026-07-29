import type { Metadata } from "next";
import "./globals.css";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = { title: "Konark Admin Panel" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", background: "var(--bg-page)", color: "var(--text-heading)" }} suppressHydrationWarning>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
