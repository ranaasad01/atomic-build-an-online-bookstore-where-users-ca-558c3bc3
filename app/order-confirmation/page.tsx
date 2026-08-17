"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, MapPin, Mail, ArrowRight, BookOpen, Star } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
type formatPrice = any;
const formatPrice: any = [];
type STORE_NAME = any;
const STORE_NAME: any = [];
type STORE_EMAIL = any;
const STORE_EMAIL: any = [];
type FREE_SHIPPING_THRESHOLD_CENTS = any;
const FREE_SHIPPING_THRESHOLD_CENTS: any = [];
import { cn } from "@/lib/utils";

const MOCK_ORDER = {
  orderNumber: "TGP-2024-08471",
  placedAt: "January 15, 2025",
  estimatedDelivery: "January 20–22, 2025",
  paymentLast4: "4242",
  email: "reader@example.com",
  shippingAddress: {
    name: "Alex Rivera",
    line1: "142 Bookshelf Lane",
    city: "Portland",
    state: "OR",
    zip: "97201",
  },
  items: [
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d0a3be67a4124765a6f662ca5e57361f.jpg",
      price_cents: 1699,
      quantity: 1,
      genre: "Fiction & Literary",
    },
    {
      id: "3",
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      cover: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/c80fb645bc8f469fa794f13a36903da3.jpg",
      price_cents: 1799,
      quantity: 2,
      genre: "Fiction & Literary",
    },
    {
      id: "7",
      title: "Lessons in Chemistry",
      author: "Bonnie Garmus",
      cover: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ad4100e44a274578a00d810500723b72.png",
      price_cents: 1599,
      quantity: 1,
      genre: "Fiction & Literary",
    },
  ],
  subtotal_cents: 6896,
  shipping_cents: 0,
  tax_cents: 552,
  total_cents: 7448,
};

const RECOMMENDED = [
  {
    id: "r1",
    title: "Intermezzo",
    author: "Sally Rooney",
    cover: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/bb527a34161f436ebe256a99a3de514f.png",
    price_cents: 1799,
    rating: 4.6,
  },
  {
    id: "r2",
    title: "James",
    author: "Percival Everett",
    cover: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/300fcde2fab848cbb348658080ac8c8a.png",
    price_cents: 1699,
    rating: 4.8,
  },
  {
    id: "r3",
    title: "The Women",
    author: "Kristin Hannah",
    cover: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/1e04177c02d041dfaf157757ec3da681.jpg",
    price_cents: 1899,
    rating: 4.9,
  },
];

const STEPS = [
  { icon: CheckCircle, label: "Order Confirmed", done: true },
  { icon: Package, label: "Packing Your Books", done: false },
  { icon: Truck, label: "Out for Delivery", done: false },
  { icon: MapPin, label: "Delivered", done: false },
];

export default function OrderConfirmationPage() {
  const t = useTranslations();

  const itemCount = MOCK_ORDER.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-24">
      {/* Hero confirmation banner */}
      <Reveal>
        <section className="relative overflow-hidden bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/8 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--accent)]/15 mb-6"
            >
              <CheckCircle className="w-10 h-10 text-[var(--accent)]" aria-hidden="true" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] mb-3"
            >
              {t("orderConfirmation.hero.title")}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed mb-6"
            >
              {t("orderConfirmation.hero.subtitle")}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.18 }}
              className="inline-flex items-center gap-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-full px-5 py-2.5 text-sm font-medium text-[hsl(var(--foreground))]"
            >
              <span className="text-[hsl(var(--muted-foreground))]">{t("orderConfirmation.hero.orderLabel")}</span>
              <span className="font-mono font-semibold text-[var(--accent)]">{MOCK_ORDER.orderNumber}</span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.24 }}
              className="mt-4 text-sm text-[hsl(var(--muted-foreground))] flex items-center justify-center gap-1.5"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {t("orderConfirmation.hero.emailSent")} <span className="font-medium text-[hsl(var(--foreground))]">{MOCK_ORDER.email}</span>
            </motion.p>
          </div>
        </section>
      </Reveal>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 space-y-10">

        {/* Order progress tracker */}
        <Reveal>
          <section aria-label={t("orderConfirmation.progress.ariaLabel")} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-6">{t("orderConfirmation.progress.title")}</h2>
            <div className="relative flex items-start justify-between gap-2">
              {/* connector line */}
              <div className="absolute top-5 left-0 right-0 h-px bg-[hsl(var(--border))] mx-[10%]" aria-hidden="true" />
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10",
                        step.done
                          ? "bg-[var(--accent)] border-[var(--accent)] text-black"
                          : "bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className={cn(
                      "text-xs font-medium text-center leading-tight",
                      step.done ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
                    )}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
              {t("orderConfirmation.progress.eta")} <span className="font-medium text-[hsl(var(--foreground))]">{MOCK_ORDER.estimatedDelivery}</span>
            </p>
          </section>
        </Reveal>

        {/* Two-column: order items + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Order items */}
          <Reveal className="lg:col-span-3">
            <section aria-label={t("orderConfirmation.items.ariaLabel")} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[hsl(var(--border))]">
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  {t("orderConfirmation.items.title")} <span className="text-[hsl(var(--muted-foreground))] font-normal text-base">({itemCount})</span>
                </h2>
              </div>
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-[hsl(var(--border))]"
              >
                {MOCK_ORDER.items.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={fadeInUp}
                    className="flex gap-4 px-6 py-5"
                  >
                    <div className="relative w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-[hsl(var(--border))] shadow-sm">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/08fe8ecfd11040cbb275adb39a97876f.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[hsl(var(--foreground))] text-sm leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{item.author}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 inline-flex items-center gap-1">
                        <BookOpen className="w-3 h-3" aria-hidden="true" />
                        {item.genre}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{formatPrice(item.price_cents * item.quantity)}</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-full px-2 py-0.5">
                        {t("orderConfirmation.items.qty")} {item.quantity}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          </Reveal>

          {/* Order summary + shipping */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Reveal>
              <section aria-label={t("orderConfirmation.summary.ariaLabel")} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">{t("orderConfirmation.summary.title")}</h2>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[hsl(var(--muted-foreground))]">{t("orderConfirmation.summary.subtotal")}</dt>
                    <dd className="font-medium text-[hsl(var(--foreground))]">{formatPrice(MOCK_ORDER.subtotal_cents)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[hsl(var(--muted-foreground))]">{t("orderConfirmation.summary.shipping")}</dt>
                    <dd className="font-medium text-[var(--accent)]">
                      {MOCK_ORDER.shipping_cents === 0 ? t("orderConfirmation.summary.freeShipping") : formatPrice(MOCK_ORDER.shipping_cents)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[hsl(var(--muted-foreground))]">{t("orderConfirmation.summary.tax")}</dt>
                    <dd className="font-medium text-[hsl(var(--foreground))]">{formatPrice(MOCK_ORDER.tax_cents)}</dd>
                  </div>
                  <div className="border-t border-[hsl(var(--border))] pt-3 flex justify-between">
                    <dt className="font-semibold text-[hsl(var(--foreground))]">{t("orderConfirmation.summary.total")}</dt>
                    <dd className="font-bold text-lg text-[hsl(var(--foreground))]">{formatPrice(MOCK_ORDER.total_cents)}</dd>
                  </div>
                </dl>
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                  <p>{t("orderConfirmation.summary.paidWith")} <span className="font-medium text-[hsl(var(--foreground))]">Visa ending {MOCK_ORDER.paymentLast4}</span></p>
                  <p>{t("orderConfirmation.summary.placedOn")} <span className="font-medium text-[hsl(var(--foreground))]">{MOCK_ORDER.placedAt}</span></p>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.08}>
              <section aria-label={t("orderConfirmation.shipping.ariaLabel")} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                  {t("orderConfirmation.shipping.title")}
                </h2>
                <address className="not-italic text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  <span className="block font-medium text-[hsl(var(--foreground))]">{MOCK_ORDER.shippingAddress.name}</span>
                  {MOCK_ORDER.shippingAddress.line1}<br />
                  {MOCK_ORDER.shippingAddress.city}, {MOCK_ORDER.shippingAddress.state} {MOCK_ORDER.shippingAddress.zip}
                </address>
              </section>
            </Reveal>
          </div>
        </div>

        {/* What happens next */}
        <Reveal>
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-6">{t("orderConfirmation.nextSteps.title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Mail,
                  heading: t("orderConfirmation.nextSteps.step1.heading"),
                  body: t("orderConfirmation.nextSteps.step1.body"),
                },
                {
                  icon: Package,
                  heading: t("orderConfirmation.nextSteps.step2.heading"),
                  body: t("orderConfirmation.nextSteps.step2.body"),
                },
                {
                  icon: Truck,
                  heading: t("orderConfirmation.nextSteps.step3.heading"),
                  body: t("orderConfirmation.nextSteps.step3.body"),
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[hsl(var(--foreground))] mb-1">{step.heading}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-[hsl(var(--muted-foreground))]">
              {t("orderConfirmation.nextSteps.support")}{" "}
              <a href={`mailto:${STORE_EMAIL}`} className="text-[var(--accent)] hover:underline font-medium">
                {STORE_EMAIL}
              </a>
            </p>
          </section>
        </Reveal>

        {/* Recommended books */}
        <Reveal>
          <section aria-label={t("orderConfirmation.recommended.ariaLabel")}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">{t("orderConfirmation.recommended.title")}</h2>
              <Link
                href="/catalog"
                className="text-sm font-medium text-[var(--accent)] hover:underline flex items-center gap-1 transition-colors"
              >
                {t("orderConfirmation.recommended.viewAll")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              {RECOMMENDED.map((book) => (
                <motion.div key={book.id} variants={fadeInUp}>
                  <Link
                    href={`/books/${book.id}`}
                    className="group block bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-12px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-[hsl(var(--muted))]">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/08fe8ecfd11040cbb275adb39a97876f.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-[hsl(var(--foreground))] leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">{book.title}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{book.author}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-sm text-[hsl(var(--foreground))]">{formatPrice(book.price_cents)}</span>
                        <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                          <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" aria-hidden="true" />
                          {book.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </Reveal>

        {/* CTA row */}
        <Reveal>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-black font-semibold px-7 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 text-sm"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              {t("orderConfirmation.cta.continueShopping")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] font-medium px-7 py-3 rounded-full hover:bg-[hsl(var(--muted))] active:scale-95 transition-all duration-200 text-sm"
            >
              {t("orderConfirmation.cta.backHome")}
            </Link>
          </div>
        </Reveal>

      </div>
    </main>
  );
}