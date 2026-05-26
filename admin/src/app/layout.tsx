import type { Metadata } from "next";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = { title: "Konark Admin Panel" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", background: "#0a0f1e", color: "#f1f5f9" }}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
