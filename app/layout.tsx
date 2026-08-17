import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "The Gilded Page — Curated Books for Discerning Readers",
    template: "%s | The Gilded Page",
  },
  description:
    "Browse thousands of titles across fiction, non-fiction, mystery, fantasy, and more. Free shipping on orders over $35. New arrivals every Tuesday.",
  openGraph: {
    title: "The Gilded Page — Curated Books for Discerning Readers",
    description:
      "A premium online bookstore for readers who believe a great book is the finest luxury.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}