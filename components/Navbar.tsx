"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, BookOpen, Menu, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      try {
        const stored = localStorage.getItem("gilded-cart");
        if (stored) {
          const items = JSON.parse(stored) as Array<{ quantity: number }>;
          setCartCount(items.reduce((sum, i) => sum + (i.quantity ?? 0), 0));
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cart-updated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    setMobileOpen(false);
  };

  const getLinkHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--primary)] shadow-[0_2px_24px_rgba(26,26,46,0.18)]"
          : "bg-[var(--primary)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md"
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-[var(--accent)]"
            >
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </motion.div>
            <span
              className="font-serif text-lg font-bold text-white tracking-tight leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Gilded Page
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.key}
                  href={getLinkHref(link.href)}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    active
                      ? "text-[var(--accent)]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {navT[link.key] ?? link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent)] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              className="relative p-2 text-white/80 hover:text-[var(--accent)] transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 h-4.5 min-w-[1.125rem] px-1 flex items-center justify-center bg-[var(--accent)] text-[var(--primary)] text-[10px] font-bold rounded-full leading-none"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            <button
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <nav
              className="flex flex-col px-4 py-3 gap-1 bg-[var(--primary)]"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.key}
                    href={getLinkHref(link.href)}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                      active
                        ? "text-[var(--accent)] bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}