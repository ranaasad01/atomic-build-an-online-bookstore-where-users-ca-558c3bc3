"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Star, ShoppingCart, Heart, ChevronRight, Minus, Plus, BookOpen, Award, Calendar, Hash, Building, Check, ArrowRight } from 'lucide-react';
import { Book } from "@/lib/data";
type getBookById = any;
const getBookById: any = [];
type getRelatedBooks = any;
const getRelatedBooks: any = [];
type formatPrice = any;
const formatPrice: any = [];
import { fadeInUp, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

// ─── Cart Context (localStorage-backed) ──────────────────────────────────────

function useCart() {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gilded-cart");
      if (stored) setCart(JSON.parse(stored));
    } catch {}
  }, []);

  const addToCart = useCallback((bookId: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === bookId);
      const next = existing
        ? prev.map((i) => (i.id === bookId ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { id: bookId, quantity: qty }];
      try {
        localStorage.setItem("gilded-cart", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { cart, addToCart };
}

// ─── Mock Reviews ─────────────────────────────────────────────────────────────

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Eleanor Marsh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A%20book%20that%20changed%20how%20I%20see%20everything",
    rating: 5,
    date: "March 12, 2024",
    title: "A book that changed how I see everything",
    body: "I finished this in a single sitting and immediately wanted to start over. The writing is luminous, the characters feel achingly real, and the central idea stayed with me for weeks. One of those rare books that earns the word 'unforgettable'.",
    verified: true,
  },
  {
    id: "r2",
    author: "James Okafor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beautifully%20written%20and%20deeply%20moving",
    rating: 5,
    date: "February 28, 2024",
    title: "Beautifully written and deeply moving",
    body: "I was skeptical of the premise at first, but the author pulls it off with such grace and intelligence. Every chapter reveals something new. The prose is precise without being cold, and the emotional payoff is enormous.",
    verified: true,
  },
  {
    id: "r3",
    author: "Sofia Reyes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thoughtful%20and%20original",
    rating: 4,
    date: "January 15, 2024",
    title: "Thoughtful and original",
    body: "A genuinely original novel that takes its ideas seriously. The middle section drags slightly, but the final third more than makes up for it. I've already recommended it to everyone I know who loves literary fiction.",
    verified: false,
  },
  {
    id: "r4",
    author: "Thomas Wren",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Exactly%20what%20I%20needed%20to%20read",
    rating: 5,
    date: "December 3, 2023",
    title: "Exactly what I needed to read",
    body: "Sometimes a book finds you at exactly the right moment. This was that book for me. It's warm without being saccharine, honest without being bleak. I cried twice and laughed out loud at least four times.",
    verified: true,
  },
];

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= Math.round(rating)
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : "fill-transparent text-[hsl(var(--muted-foreground))]"
          )}
        />
      ))}
    </div>
  );
}

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = "description" | "details" | "reviews";

// ─── Page Component ───────────────────────────────────────────────────────────

interface BookDetailClientProps {
  book: Book;
  related: Book[];
}

function BookDetailClient({ book, related }: BookDetailClientProps) {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(book.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: t("bookDetail.tabs.description") },
    { key: "details", label: t("bookDetail.tabs.details") },
    { key: "reviews", label: t("bookDetail.tabs.reviews") },
  ];

  const tabVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Breadcrumb ── */}
      <Reveal>
        <nav
          aria-label="Breadcrumb"
          className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {t("bookDetail.breadcrumb.home")}
                </Link>
              </li>
              <li>
                <ChevronRight size={14} aria-hidden="true" />
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {t("bookDetail.breadcrumb.catalog")}
                </Link>
              </li>
              <li>
                <ChevronRight size={14} aria-hidden="true" />
              </li>
              <li
                className="truncate max-w-[200px] text-[hsl(var(--foreground))] font-medium"
                aria-current="page"
              >
                {book.title}
              </li>
            </ol>
          </div>
        </nav>
      </Reveal>

      {/* ── Hero Split ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Cover Image */}
          <Reveal className="flex justify-center lg:justify-end">
            <motion.div
              className="relative w-full max-w-sm"
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
            >
              {/* Decorative glow */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                style={{ background: "var(--accent)" }}
                aria-hidden="true"
              />
              <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.35)] border border-[hsl(var(--border))]">
                <img
                  src={book.cover_image_url}
                  alt={t("bookDetail.coverAlt", { title: book.title })}
                  className="w-full object-cover aspect-[2/3]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/6e6dfe5f698f46ebaa1eb8b381447e27.jpg";
                  }}
                />
                {book.is_bestseller && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-black shadow-md">
                      <Award size={12} aria-hidden="true" />
                      {t("bookDetail.badge.bestseller")}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </Reveal>

          {/* Book Info */}
          <Reveal>
            <motion.div
              className="flex flex-col gap-6"
              variants={slideInRight}
              initial="hidden"
              animate="visible"
            >
              {/* Genre badge */}
              <div>
                <span className="inline-block rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  {book.genre}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl lg:text-5xl leading-tight text-balance">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg text-[hsl(var(--muted-foreground))]">
                  {t("bookDetail.by")}{" "}
                  <span className="font-semibold text-[hsl(var(--foreground))]">
                    {book.author}
                  </span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating rating={book.rating} size={20} />
                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  ({book.review_count.toLocaleString("en-US")}{" "}
                  {t("bookDetail.reviews")})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[hsl(var(--foreground))]">
                  {formatPrice(book.price_cents)}
                </span>
                {book.stock > 0 ? (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {t("bookDetail.inStock", { count: book.stock })}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-500">
                    {t("bookDetail.outOfStock")}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-3">
                {book.description}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Quantity selector */}
                <div className="flex items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label={t("bookDetail.decreaseQty")}
                    className="flex h-12 w-12 items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span
                    className="w-12 text-center text-base font-semibold text-[hsl(var(--foreground))]"
                    aria-live="polite"
                    aria-label={t("bookDetail.quantity")}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                    disabled={quantity >= book.stock}
                    aria-label={t("bookDetail.increaseQty")}
                    className="flex h-12 w-12 items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>

                {/* Add to Cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
                    addedToCart
                      ? "bg-emerald-600 text-white"
                      : "bg-[var(--accent)] text-black hover:opacity-90"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={16} aria-hidden="true" />
                        {t("bookDetail.addedToCart")}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart size={16} aria-hidden="true" />
                        {t("bookDetail.addToCart")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  onClick={() => setWishlisted((w) => !w)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={
                    wishlisted
                      ? t("bookDetail.removeWishlist")
                      : t("bookDetail.addWishlist")
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors shadow-sm"
                >
                  <Heart
                    size={20}
                    aria-hidden="true"
                    className={cn(
                      "transition-colors",
                      wishlisted ? "fill-red-500 text-red-500" : ""
                    )}
                  />
                </motion.button>
              </div>

              {/* Free shipping nudge */}
              <p className="text-xs text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))] pt-4">
                {t("bookDetail.freeShippingNote")}
              </p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Tabs: Description / Details / Reviews ── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Tab bar */}
          <div className="border-b border-[hsl(var(--border))] mb-8">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none",
                    activeTab === tab.key
                      ? "text-[hsl(var(--foreground))]"
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
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="max-w-3xl"
              >
                <p className="text-[hsl(var(--foreground))] leading-relaxed text-base sm:text-lg">
                  {book.description}
                </p>
              </motion.div>
            )}

            {activeTab === "details" && (
              <motion.div
                key="details"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <dl className="divide-y divide-[hsl(var(--border))] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                  {[
                    {
                      icon: <Hash size={16} aria-hidden="true" />,
                      label: t("bookDetail.details.isbn"),
                      value: book.isbn ?? t("bookDetail.details.na"),
                    },
                    {
                      icon: <Building size={16} aria-hidden="true" />,
                      label: t("bookDetail.details.publisher"),
                      value: book.publisher ?? t("bookDetail.details.na"),
                    },
                    {
                      icon: <Calendar size={16} aria-hidden="true" />,
                      label: t("bookDetail.details.published"),
                      value: book.publication_date ?? t("bookDetail.details.na"),
                    },
                    {
                      icon: <BookOpen size={16} aria-hidden="true" />,
                      label: t("bookDetail.details.pages"),
                      value: book.pages
                        ? book.pages.toLocaleString("en-US")
                        : t("bookDetail.details.na"),
                    },
                    {
                      icon: <Star size={16} aria-hidden="true" />,
                      label: t("bookDetail.details.genre"),
                      value: book.genre,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <span className="text-[hsl(var(--muted-foreground))]">
                        {row.icon}
                      </span>
                      <dt className="w-32 shrink-0 text-sm font-medium text-[hsl(var(--muted-foreground))]">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-[hsl(var(--foreground))] font-medium">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {/* Summary bar */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                  <div className="flex flex-col items-center gap-1 min-w-[80px]">
                    <span className="text-5xl font-bold text-[hsl(var(--foreground))]">
                      {book.rating.toFixed(1)}
                    </span>
                    <StarRating rating={book.rating} size={18} />
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {book.review_count.toLocaleString("en-US")}{" "}
                      {t("bookDetail.reviews")}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        star === 5
                          ? 68
                          : star === 4
                          ? 22
                          : star === 3
                          ? 7
                          : star === 2
                          ? 2
                          : 1;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs w-4 text-right text-[hsl(var(--muted-foreground))]">
                            {star}
                          </span>
                          <Star
                            size={12}
                            className="fill-[var(--accent)] text-[var(--accent)]"
                            aria-hidden="true"
                          />
                          <div className="flex-1 h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-[var(--accent)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * (5 - star) }}
                            />
                          </div>
                          <span className="text-xs w-8 text-[hsl(var(--muted-foreground))]">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <motion.div
                  className="grid gap-5 sm:grid-cols-2"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {MOCK_REVIEWS.map((review) => (
                    <motion.article
                      key={review.id}
                      variants={fadeInUp}
                      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="h-10 w-10 rounded-full object-cover border border-[hsl(var(--border))]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`;
                            }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                              {review.author}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <Check size={10} aria-hidden="true" />
                            {t("bookDetail.verifiedPurchase")}
                          </span>
                        )}
                      </div>
                      <StarRating rating={review.rating} size={14} />
                      <div>
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                          {review.title}
                        </p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                          {review.body}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </Reveal>

      {/* ── You May Also Like ── */}
      {related.length > 0 && (
        <Reveal>
          <section className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                  {t("bookDetail.related.heading")}
                </h2>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {t("bookDetail.related.viewAll")}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {related.map((rel, i) => (
                  <Reveal key={rel.id} delay={i * 0.08} className="snap-start shrink-0 w-52">
                    <Link href={`/books/${rel.id}`} className="group block">
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.16)] transition-shadow"
                      >
                        <div className="aspect-[2/3] overflow-hidden">
                          <img
                            src={rel.cover_image_url}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/6e6dfe5f698f46ebaa1eb8b381447e27.jpg";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold text-[hsl(var(--foreground))] line-clamp-2 leading-snug">
                            {rel.title}
                          </p>
                          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                            {rel.author}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-[hsl(var(--foreground))]">
                              {formatPrice(rel.price_cents)}
                            </span>
                            <StarRating rating={rel.rating} size={11} />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}
    </main>
  );
}

// ─── Page (server-compatible wrapper) ────────────────────────────────────────

export default function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const book = getBookById(params.id);
  const related = book ? getRelatedBooks(book.id, book.genre, 4) : [];

  if (!book) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[hsl(var(--background))]">
        <BookOpen size={48} className="text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Book not found
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          We could not find the book you were looking for.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-opacity"
        >
          <ArrowRight size={16} aria-hidden="true" />
          Browse all books
        </Link>
      </main>
    );
  }

  return <BookDetailClient book={book} related={related} />;
}