"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Mail, Camera as Instagram, MessageCircle as Twitter, Globe as Facebook } from 'lucide-react';
import { navLinks, BRAND } from "@/lib/data";

export default function Footer() {
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const footerT = t.raw("footer") as Record<string, string>;
  const pathname = usePathname();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getLinkHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  };

  const shopLinks = [
    { label: footerT["new-arrivals"] ?? "New Arrivals", href: "/catalog" },
    { label: footerT["bestsellers"] ?? "Bestsellers", href: "/catalog" },
    { label: footerT["featured"] ?? "Featured Books", href: "/catalog" },
    { label: footerT["gift-cards"] ?? "Gift Cards", href: "/catalog" },
  ];

  const helpLinks = [
    { label: footerT["shipping"] ?? "Shipping & Delivery", href: "/catalog" },
    { label: footerT["returns"] ?? "Returns & Exchanges", href: "/catalog" },
    { label: footerT["faq"] ?? "FAQ", href: "/catalog" },
    { label: footerT["contact"] ?? "Contact Us", href: "/catalog" },
  ];

  return (
    <footer className="bg-[var(--primary)] text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md"
            >
              <BookOpen className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
              <span
                className="font-serif text-base font-bold text-white tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {BRAND.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-5">
              {footerT["tagline"] ?? "A curated bookstore for readers who believe a great book is the finest luxury."}
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
              ].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ scale: 1.15, color: "var(--accent)" }}
                  className="text-white/50 hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {footerT["nav-heading"] ?? "Navigate"}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getLinkHref(link.href)}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {footerT["shop-heading"] ?? "Shop"}
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help + newsletter */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {footerT["help-heading"] ?? "Help"}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${BRAND.email}`}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {BRAND.email}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            {footerT["copyright"] ?? `© ${new Date().getFullYear()} The Gilded Page. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/catalog" className="hover:text-white/70 transition-colors">
              {footerT["privacy"] ?? "Privacy Policy"}
            </Link>
            <Link href="/catalog" className="hover:text-white/70 transition-colors">
              {footerT["terms"] ?? "Terms of Sale"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}