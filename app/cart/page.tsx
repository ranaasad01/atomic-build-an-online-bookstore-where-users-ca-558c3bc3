"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { Book, CartItem } from "@/lib/data";
type formatPrice = any;
const formatPrice: any = [];
type FREE_SHIPPING_THRESHOLD_CENTS = any;
const FREE_SHIPPING_THRESHOLD_CENTS: any = [];
type FLAT_SHIPPING_CENTS = any;
const FLAT_SHIPPING_CENTS: any = [];
import { cn } from "@/lib/utils";

// ─── Cart persistence helpers ────────────────────────────────────────────────

const CART_KEY = "gilded_page_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// ─── Tax rate ────────────────────────────────────────────────────────────────

const TAX_RATE = 0.08;

// ─── CartItemRow ─────────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  const t = useTranslations();
  const { book, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      className="flex gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
    >
      {/* Cover */}
      <Link href={`/books/${book.id}`} className="shrink-0">
        <div className="relative h-28 w-20 overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <Image
            src={book.cover_image_url}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        <div>
          <Link
            href={`/books/${book.id}`}
            className="block text-sm font-semibold leading-snug text-[hsl(var(--foreground))] hover:text-[var(--accent)] transition-colors line-clamp-2"
          >
            {book.title}
          </Link>
          <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{book.author}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] capitalize">{book.genre}</p>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-1 py-0.5">
            <button
              onClick={() => onDecrease(book.id)}
              aria-label={t("cart.decreaseQty")}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-semibold tabular-nums text-[hsl(var(--foreground))]">
              {quantity}
            </span>
            <button
              onClick={() => onIncrease(book.id)}
              aria-label={t("cart.increaseQty")}
              disabled={quantity >= book.stock}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price + remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">
              {formatPrice(book.price_cents * quantity)}
            </span>
            <button
              onClick={() => onRemove(book.id)}
              aria-label={t("cart.removeItem")}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CartSummary ─────────────────────────────────────────────────────────────

interface CartSummaryProps {
  subtotalCents: number;
}

function CartSummary({ subtotalCents }: CartSummaryProps) {
  const t = useTranslations();
  const isFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = subtotalCents === 0 ? 0 : isFreeShipping ? 0 : FLAT_SHIPPING_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] sticky top-24">
      <h2 className="text-base font-bold tracking-tight text-[hsl(var(--foreground))] mb-5">
        {t("cart.summaryTitle")}
      </h2>

      {/* Free shipping progress */}
      {subtotalCents > 0 && !isFreeShipping && (
        <div className="mb-5 rounded-xl bg-[hsl(var(--muted))] px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            <p className="text-xs font-medium text-[hsl(var(--foreground))]">
              {t("cart.freeShippingProgress", { amount: formatPrice(remainingForFreeShipping) })}
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[hsl(var(--border))] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100, 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {subtotalCents > 0 && isFreeShipping && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 border border-emerald-100">
          <Truck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <p className="text-xs font-semibold text-emerald-700">{t("cart.freeShippingUnlocked")}</p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
          <span>{t("cart.subtotal")}</span>
          <span className="font-medium text-[hsl(var(--foreground))]">{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
          <span>{t("cart.shipping")}</span>
          <span className={cn("font-medium", isFreeShipping ? "text-emerald-600" : "text-[hsl(var(--foreground))]")}>
            {subtotalCents === 0
              ? formatPrice(0)
              : isFreeShipping
              ? t("cart.free")
              : formatPrice(shippingCents)}
          </span>
        </div>
        <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
          <span>{t("cart.tax")}</span>
          <span className="font-medium text-[hsl(var(--foreground))]">{formatPrice(taxCents)}</span>
        </div>
        <div className="my-1 border-t border-[hsl(var(--border))]" />
        <div className="flex justify-between text-base font-bold text-[hsl(var(--foreground))]">
          <span>{t("cart.total")}</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
      </div>

      {/* Promo code */}
      <div className="mt-5">
        <button className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[hsl(var(--border))] px-4 py-2.5 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {t("cart.promoCode")}
        </button>
      </div>

      {/* CTA */}
      <Link
        href="/checkout"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-90 active:scale-[0.98] transition-all duration-200"
      >
        {t("cart.checkout")}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      <p className="mt-3 text-center text-[10px] text-[hsl(var(--muted-foreground))]">
        {t("cart.secureCheckout")}
      </p>
    </div>
  );
}

// ─── EmptyCartMessage ─────────────────────────────────────────────────────────

function EmptyCartMessage() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[hsl(var(--muted))]"
      >
        <ShoppingBag className="h-10 w-10 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]"
      >
        {t("cart.emptyTitle")}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="mt-2 max-w-xs text-sm text-[hsl(var(--muted-foreground))] leading-relaxed"
      >
        {t("cart.emptyBody")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8"
      >
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-bold text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-90 transition-all duration-200"
        >
          {t("cart.browseBooks")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const t = useTranslations();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setMounted(true);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const handleIncrease = useCallback(
    (id: string) => {
      persist(
        items.map((ci) =>
          ci.book.id === id && ci.quantity < ci.book.stock
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    },
    [items, persist]
  );

  const handleDecrease = useCallback(
    (id: string) => {
      const next = items
        .map((ci) =>
          ci.book.id === id ? { ...ci, quantity: ci.quantity - 1 } : ci
        )
        .filter((ci) => ci.quantity > 0);
      persist(next);
    },
    [items, persist]
  );

  const handleRemove = useCallback(
    (id: string) => {
      persist(items.filter((ci) => ci.book.id !== id));
    },
    [items, persist]
  );

  const subtotalCents = items.reduce(
    (sum, ci) => sum + ci.book.price_cents * ci.quantity,
    0
  );

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
              ))}
            </div>
            <div className="h-80 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
              {t("cart.title")}
            </h1>
            {totalItems > 0 && (
              <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                {t("cart.itemCount", { count: totalItems })}
              </p>
            )}
          </div>
        </Reveal>

        {items.length === 0 ? (
          <Reveal>
            <EmptyCartMessage />
          </Reveal>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
            {/* Left: item list */}
            <div>
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div key={item.book.id} layout className="mb-4">
                    <CartItemRow
                      item={item}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue shopping */}
              <Reveal delay={0.1}>
                <div className="mt-6">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                    {t("cart.continueShopping")}
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: summary */}
            <Reveal delay={0.08}>
              <CartSummary subtotalCents={subtotalCents} />
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}