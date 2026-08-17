"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Star, ChevronDown, ShoppingCart, Heart } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GENRES, Book } from "@/lib/data";
type MOCK_BOOKS = any;
const MOCK_BOOKS: any = [];
type SORT_OPTIONS = any;
const SORT_OPTIONS: any = [];
type formatPrice = any;
const formatPrice: any = [];
type SortOption = any;
const SortOption: any = [];
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";

// ─── Cart helpers (localStorage-based, no external store needed) ─────────────
function addToCart(book: Book) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("cart");
    const cart: { bookId: string; quantity: number }[] = raw ? JSON.parse(raw) : [];
    const existing = cart.find((i) => i.bookId === book.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, book.stock);
    } else {
      cart.push({ bookId: book.id, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  } catch {
    // silently ignore
  }
}

// ─── Star rating display ──────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3.5 w-3.5",
              star <= Math.round(rating)
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "fill-transparent text-[hsl(var(--muted-foreground))]"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-[hsl(var(--muted-foreground))]">
        {rating.toFixed(1)} ({count.toLocaleString("en-US")})
      </span>
    </div>
  );
}

// ─── Book card ────────────────────────────────────────────────────────────────
function BookCard({ book }: { book: Book }) {
  const t = useTranslations();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      addToCart(book);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    },
    [book]
  );

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_16px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-300"
    >
      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted((w) => !w);
        }}
        aria-label={t("catalog.wishlistToggle")}
        className="absolute top-3 right-3 z-10 rounded-full bg-[hsl(var(--background))]/80 backdrop-blur-sm p-1.5 border border-[hsl(var(--border))] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            wishlisted ? "fill-rose-500 text-rose-500" : "text-[hsl(var(--muted-foreground))]"
          )}
        />
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {book.is_bestseller && (
          <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
            {t("catalog.badgeBestseller")}
          </span>
        )}
        {book.is_featured && !book.is_bestseller && (
          <span className="rounded-full bg-[hsl(var(--foreground))] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--background))]">
            {t("catalog.badgeFeatured")}
          </span>
        )}
      </div>

      {/* Cover */}
      <Link href={`/books/${book.id}`} className="block overflow-hidden bg-[hsl(var(--muted))] aspect-[2/3] relative">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/89e6eb04496146cd86adb8d8a46a72b1.jpg";
          }}
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--accent)]">
            {book.genre}
          </span>
          <Link href={`/books/${book.id}`}>
            <h3 className="mt-0.5 text-sm font-semibold leading-snug text-[hsl(var(--foreground))] line-clamp-2 hover:text-[var(--accent)] transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{book.author}</p>
        </div>

        <StarRating rating={book.rating} count={book.review_count} />

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[hsl(var(--border))]">
          <span className="text-base font-bold text-[hsl(var(--foreground))]">
            {formatPrice(book.price_cents)}
          </span>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            aria-label={t("catalog.addToCart")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              added
                ? "bg-emerald-500 text-white"
                : book.stock === 0
                ? "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                : "bg-[var(--accent)] text-black hover:brightness-110"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? t("catalog.added") : book.stock === 0 ? t("catalog.outOfStock") : t("catalog.addToCart")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CatalogBrowseBooksPage() {
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("bestselling");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const genres = ["All", ...GENRES] as const;

  const filtered = useMemo(() => {
    let books = [...MOCK_BOOKS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    // Genre
    if (activeGenre !== "All") {
      books = books.filter((b) => b.genre === activeGenre);
    }

    // Price range
    books = books.filter(
      (b) => b.price_cents >= minPrice * 100 && b.price_cents <= maxPrice * 100
    );

    // In stock
    if (onlyInStock) books = books.filter((b) => b.stock > 0);

    // Featured
    if (onlyFeatured) books = books.filter((b) => b.is_featured);

    // Sort
    switch (sortBy) {
      case "bestselling":
        books.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
        break;
      case "newest":
        books.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "price_asc":
        books.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price_desc":
        books.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "rating":
        books.sort((a, b) => b.rating - a.rating);
        break;
    }

    return books;
  }, [searchQuery, activeGenre, sortBy, minPrice, maxPrice, onlyInStock, onlyFeatured]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveGenre("All");
    setSortBy("bestselling");
    setMinPrice(0);
    setMaxPrice(50);
    setOnlyInStock(false);
    setOnlyFeatured(false);
  }, []);

  const hasActiveFilters =
    searchQuery || activeGenre !== "All" || onlyInStock || onlyFeatured || minPrice > 0 || maxPrice < 50;

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Page header ── */}
      <Reveal>
        <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {t("catalog.eyebrow")}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl lg:text-5xl">
                  {t("catalog.heading")}
                </h1>
                <p className="mt-3 max-w-xl text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {t("catalog.subheading")}
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("catalog.searchPlaceholder")}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2.5 pl-10 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    aria-label={t("catalog.clearSearch")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Genre pills ── */}
        <Reveal>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-200 shrink-0",
                  activeGenre === genre
                    ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                    : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[var(--accent)] hover:text-[hsl(var(--foreground))]"
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Toolbar: sort + filter toggle ── */}
        <Reveal delay={0.05}>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              <span className="font-semibold text-[hsl(var(--foreground))]">{filtered.length}</span>{" "}
              {t("catalog.resultsLabel")}
            </p>

            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 pl-3 pr-8 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters((f) => !f)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200",
                  showFilters
                    ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                    : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:border-[var(--accent)]"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t("catalog.filters")}
              </button>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 transition-colors dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("catalog.clearAll")}
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Advanced filters panel ── */}
        {showFilters && (
          <Reveal delay={0.05}>
            <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price range */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {t("catalog.filterPriceRange")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="$0"
                  />
                  <span className="text-[hsl(var(--muted-foreground))] text-sm">–</span>
                  <input
                    type="number"
                    min={minPrice}
                    max={200}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="$50"
                  />
                </div>
              </div>

              {/* In stock */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {t("catalog.filterAvailability")}
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[var(--accent)]"
                  />
                  <span className="text-sm text-[hsl(var(--foreground))]">{t("catalog.filterInStock")}</span>
                </label>
              </div>

              {/* Featured */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {t("catalog.filterCuration")}
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFeatured}
                    onChange={(e) => setOnlyFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[var(--accent)]"
                  />
                  <span className="text-sm text-[hsl(var(--foreground))]">{t("catalog.filterFeatured")}</span>
                </label>
              </div>

              {/* Rating hint */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {t("catalog.filterTip")}
                </label>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {t("catalog.filterTipBody")}
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Book grid ── */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <Reveal>
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="rounded-full bg-[hsl(var(--muted))] p-5">
                  <Search className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
                </div>
                <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                  {t("catalog.emptyHeading")}
                </h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm">
                  {t("catalog.emptyBody")}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:brightness-110 transition"
                >
                  {t("catalog.emptyReset")}
                </button>
              </div>
            </Reveal>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Newsletter / promo strip ── */}
        <Reveal>
          <section className="mt-20 rounded-3xl bg-[hsl(var(--foreground))] px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              {t("catalogPromo.eyebrow")}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[hsl(var(--background))] sm:text-3xl">
              {t("catalogPromo.heading")}
            </h2>
            <p className="mt-3 text-sm text-[hsl(var(--background))]/70 max-w-md mx-auto leading-relaxed">
              {t("catalogPromo.body")}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto"
            >
              <input
                type="email"
                placeholder={t("catalogPromo.emailPlaceholder")}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-[hsl(var(--background))] placeholder:text-[hsl(var(--background))]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:brightness-110 transition shrink-0"
              >
                {t("catalogPromo.cta")}
              </button>
            </form>
          </section>
        </Reveal>

        <div className="h-16" />
      </div>
    </main>
  );
}