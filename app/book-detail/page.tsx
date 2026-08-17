"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, ChevronRight, BookOpen, Award, Truck, RotateCcw, Plus, Minus, Check } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Book, CartItem } from "@/lib/data";
type MOCK_BOOKS = any;
const MOCK_BOOKS: any = [];
type formatPrice = any;
const formatPrice: any = [];
type getFeaturedBooks = any;
const getFeaturedBooks: any = [];

// ─── Inline mock: pick a specific book as the "detail" subject ───────────────
const DETAIL_BOOK: Book = {
  id: "1",
  title: "The Midnight Library",
  author: "Matt Haig",
  description:
    "Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right — to undo every regret, live every life she never chose, and discover what truly makes a life worth living. Matt Haig's beloved novel is a dazzling meditation on possibility, second chances, and the quiet courage it takes to keep going.",
  genre: "Fiction & Literary",
  price_cents: 1699,
  cover_image_url: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d0a3be67a4124765a6f662ca5e57361f.jpg",
  rating: 4.8,
  review_count: 3241,
  is_featured: true,
  is_bestseller: true,
  stock: 42,
  isbn: "978-1-78689-913-1",
  publisher: "Canongate Books",
  publication_date: "September 29, 2020",
  pages: 304,
};

const RELATED_BOOKS: Book[] = [
  {
    id: "2",
    title: "Demon Copperhead",
    author: "Barbara Kingsolver",
    description:
      "Pulitzer Prize winner — a searing reimagining of David Copperfield set in Appalachian America.",
    genre: "Fiction & Literary",
    price_cents: 1899,
    cover_image_url: "/images/demon-copperhead-barbara-kingsolver-book-cover.jpg",
    rating: 4.7,
    review_count: 2108,
    is_featured: true,
    is_bestseller: false,
    stock: 28,
  },
  {
    id: "3",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    description:
      "A sweeping love story about creativity, ambition, and the games we play with our lives.",
    genre: "Fiction & Literary",
    price_cents: 1799,
    cover_image_url: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/c80fb645bc8f469fa794f13a36903da3.jpg",
    rating: 4.9,
    review_count: 1874,
    is_featured: false,
    is_bestseller: true,
    stock: 15,
  },
  {
    id: "4",
    title: "Lessons in Chemistry",
    author: "Bonnie Garmus",
    description:
      "A chemist turned cooking show host in the 1960s inspires a nation of housewives to think for themselves.",
    genre: "Fiction & Literary",
    price_cents: 1599,
    cover_image_url: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ad4100e44a274578a00d810500723b72.png",
    rating: 4.6,
    review_count: 2890,
    is_featured: false,
    is_bestseller: true,
    stock: 33,
  },
];

const REVIEWS = [
  {
    id: "r1",
    name: "Sarah M.",
    rating: 5,
    date: "March 12, 2024",
    title: "A book that changed how I see my own life",
    body: "I picked this up on a whim and finished it in two sittings. Haig writes with such warmth and clarity about regret, hope, and what it means to truly live. I've already bought three copies for friends.",
    verified: true,
  },
  {
    id: "r2",
    name: "James T.",
    rating: 5,
    date: "February 28, 2024",
    title: "Quietly profound",
    body: "The premise sounds gimmicky but the execution is anything but. Each alternate life Nora explores feels fully realized. By the end I was in tears — the good kind.",
    verified: true,
  },
  {
    id: "r3",
    name: "Priya K.",
    rating: 4,
    date: "January 15, 2024",
    title: "Beautifully written, slightly predictable",
    body: "The writing is gorgeous and the emotional beats land hard. I guessed the ending fairly early, but the journey there was so enjoyable it didn't matter.",
    verified: false,
  },
];

// ─── Star renderer ────────────────────────────────────────────────────────────
function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating)
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : "fill-transparent text-[hsl(var(--muted-foreground))]"
          )}
        />
      ))}
    </span>
  );
}

// ─── Related book card ────────────────────────────────────────────────────────
function RelatedBookCard({ book }: { book: Book }) {
  const t = useTranslations();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.14)] transition-shadow duration-300"
    >
      <Link href={`/books/${book.id}`} className="block aspect-[2/3] overflow-hidden bg-[hsl(var(--muted))]">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col gap-1.5 p-4">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-[hsl(var(--foreground))] leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{book.author}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StarRating rating={book.rating} size="sm" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            ({book.review_count.toLocaleString("en-US")})
          </span>
        </div>
        <p className="mt-1 font-bold text-[hsl(var(--foreground))]">
          {formatPrice(book.price_cents)}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookDetailPage() {
  const t = useTranslations();
  const book = DETAIL_BOOK;

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "reviews">(
    "description"
  );

  function handleAddToCart() {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  const ratingBreakdown = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 2 },
  ];

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Breadcrumb ── */}
      <Reveal>
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                {t("bookDetail.breadcrumb.home")}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/catalog" className="hover:text-[var(--accent)] transition-colors">
                {t("bookDetail.breadcrumb.catalog")}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                href={`/catalog?genre=${encodeURIComponent(book.genre)}`}
                className="hover:text-[var(--accent)] transition-colors"
              >
                {book.genre}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[hsl(var(--foreground))] font-medium line-clamp-1">
                {book.title}
              </span>
            </nav>
          </div>
        </div>
      </Reveal>

      {/* ── Hero: Cover + Purchase Panel ── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
            {/* Cover */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-[320px] lg:max-w-none aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.08),0_24px_64px_-12px_rgba(0,0,0,0.22)] border border-[hsl(var(--border))]"
              >
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
                {book.is_bestseller && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-black shadow">
                    <Award className="h-3 w-3" />
                    {t("bookDetail.badge.bestseller")}
                  </div>
                )}
              </motion.div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full max-w-[320px] lg:max-w-none">
                {[
                  { icon: Truck, label: t("bookDetail.trust.shipping") },
                  { icon: RotateCcw, label: t("bookDetail.trust.returns") },
                  { icon: BookOpen, label: t("bookDetail.trust.authentic") },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs text-[hsl(var(--muted-foreground))]"
                  >
                    <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Info + Purchase */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {/* Genre pill */}
              <Link
                href={`/catalog?genre=${encodeURIComponent(book.genre)}`}
                className="inline-flex w-fit items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
              >
                {book.genre}
              </Link>

              {/* Title & Author */}
              <div>
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight text-balance">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg text-[hsl(var(--muted-foreground))]">
                  {t("bookDetail.by")} <span className="font-medium text-[hsl(var(--foreground))]">{book.author}</span>
                </p>
              </div>

              {/* Rating row */}
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={book.rating} size="lg" />
                <span className="text-lg font-bold text-[hsl(var(--foreground))]">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  ({book.review_count.toLocaleString("en-US")} {t("bookDetail.reviews")})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[hsl(var(--foreground))]">
                  {formatPrice(book.price_cents)}
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {t("bookDetail.freeShippingNote")}
                </span>
              </div>

              {/* Stock */}
              <p
                className={cn(
                  "text-sm font-medium",
                  book.stock > 10
                    ? "text-emerald-600"
                    : book.stock > 0
                    ? "text-amber-600"
                    : "text-red-600"
                )}
              >
                {book.stock > 10
                  ? t("bookDetail.stock.inStock")
                  : book.stock > 0
                  ? t("bookDetail.stock.lowStock", { count: book.stock })
                  : t("bookDetail.stock.outOfStock")}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    aria-label={t("bookDetail.qty.decrease")}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-[hsl(var(--foreground))]">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(book.stock, q + 1))
                    }
                    className="flex h-11 w-11 items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    aria-label={t("bookDetail.qty.increase")}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to cart */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className={cn(
                    "flex flex-1 min-w-[180px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300",
                    addedToCart
                      ? "bg-emerald-600 text-white"
                      : "bg-[var(--accent)] text-black hover:opacity-90"
                  )}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t("bookDetail.cta.added")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      {t("bookDetail.cta.addToCart")}
                    </>
                  )}
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setWishlisted((w) => !w)}
                  aria-label={t("bookDetail.cta.wishlist")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      wishlisted ? "fill-red-500 text-red-500" : ""
                    )}
                  />
                </motion.button>

                {/* Share */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={t("bookDetail.cta.share")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>

              {/* View cart link */}
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                {t("bookDetail.viewCart")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Tabs: Description / Details / Reviews ── */}
      <Reveal>
        <section className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto border-b border-[hsl(var(--border))]">
              {(
                [
                  { key: "description", label: t("bookDetail.tab.description") },
                  { key: "details", label: t("bookDetail.tab.details") },
                  { key: "reviews", label: t("bookDetail.tab.reviews") },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative shrink-0 px-6 py-4 text-sm font-semibold transition-colors",
                    activeTab === tab.key
                      ? "text-[var(--accent)]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-10">
              {/* Description */}
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="max-w-3xl"
                >
                  <p className="text-base leading-relaxed text-[hsl(var(--foreground))] text-pretty">
                    {book.description}
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: t("bookDetail.about.genre"),
                        value: book.genre,
                      },
                      {
                        label: t("bookDetail.about.pages"),
                        value: book.pages
                          ? `${book.pages} ${t("bookDetail.about.pagesUnit")}`
                          : "—",
                      },
                      {
                        label: t("bookDetail.about.publisher"),
                        value: book.publisher ?? "—",
                      },
                      {
                        label: t("bookDetail.about.published"),
                        value: book.publication_date ?? "—",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[hsl(var(--foreground))]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Details */}
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="max-w-2xl"
                >
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                      {[
                        { label: t("bookDetail.details.isbn"), value: book.isbn ?? "—" },
                        { label: t("bookDetail.details.publisher"), value: book.publisher ?? "—" },
                        { label: t("bookDetail.details.published"), value: book.publication_date ?? "—" },
                        { label: t("bookDetail.details.pages"), value: book.pages ? String(book.pages) : "—" },
                        { label: t("bookDetail.details.genre"), value: book.genre },
                        { label: t("bookDetail.details.language"), value: "English" },
                        { label: t("bookDetail.details.format"), value: "Paperback" },
                      ].map(({ label, value }) => (
                        <tr key={label}>
                          <td className="py-3 pr-6 font-semibold text-[hsl(var(--muted-foreground))] w-40">
                            {label}
                          </td>
                          <td className="py-3 text-[hsl(var(--foreground))]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="max-w-4xl"
                >
                  {/* Summary */}
                  <div className="mb-10 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-start">
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-10 py-6">
                      <span className="text-6xl font-bold text-[hsl(var(--foreground))]">
                        {book.rating.toFixed(1)}
                      </span>
                      <StarRating rating={book.rating} size="md" />
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {book.review_count.toLocaleString("en-US")} {t("bookDetail.reviews")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {ratingBreakdown.map(({ stars, pct }) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="w-8 text-right text-xs text-[hsl(var(--muted-foreground))]">
                            {stars}
                          </span>
                          <Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                          <div className="flex-1 h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut", delay: stars * 0.05 }}
                              className="h-full rounded-full bg-[var(--accent)]"
                            />
                          </div>
                          <span className="w-8 text-xs text-[hsl(var(--muted-foreground))]">
                            {pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="flex flex-col gap-6">
                    {REVIEWS.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[hsl(var(--foreground))]">
                                {review.name}
                              </span>
                              {review.verified && (
                                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                  <Check className="h-3 w-3" />
                                  {t("bookDetail.review.verified")}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                              {review.date}
                            </p>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <p className="font-semibold text-[hsl(var(--foreground))] mb-1">
                          {review.title}
                        </p>
                        <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                          {review.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Related Books ── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {t("bookDetail.related.heading")}
            </h2>
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              {t("bookDetail.related.viewAll")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3"
          >
            {RELATED_BOOKS.map((rb, i) => (
              <Reveal key={rb.id} delay={i * 0.08}>
                <RelatedBookCard book={rb} />
              </Reveal>
            ))}
          </motion.div>
        </section>
      </Reveal>

      {/* ── Newsletter / CTA strip ── */}
      <Reveal>
        <section className="bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                {t("bookDetail.newsletter.heading")}
              </h2>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {t("bookDetail.newsletter.subheading")}
              </p>
            </div>
            <Link
              href="/catalog"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity"
            >
              <BookOpen className="h-4 w-4" />
              {t("bookDetail.newsletter.cta")}
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}