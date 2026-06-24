import type { Metadata } from "next";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = { title: "Konark Admin Panel" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", background: "#f5f0e8", color: "#1a0f00" }} suppressHydrationWarning>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
