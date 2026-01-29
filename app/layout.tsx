import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/footer/Footer"; // 👈 import footer

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />

        {/* Page content */}
        <main className="flex-grow">{children}</main>

        {/* Footer on every page */}
        <Footer />
      </body>
    </html>
  );
}
