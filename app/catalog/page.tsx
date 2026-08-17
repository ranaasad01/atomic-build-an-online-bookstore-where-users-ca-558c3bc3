"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Grid, List, Star, ChevronDown, ChevronRight, SlidersHorizontal, X, ShoppingCart, Heart } from 'lucide-react';
import { GENRES, Book, Genre } from "@/lib/data";
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
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Cart context (local, simple) ────────────────────────────────────────────
function useLocalCart() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const add = useCallback((id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return { cart, add, count };
}

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useMemo(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Price range options ──────────────────────────────────────────────────────
const PRICE_RANGES = [
  { label: "Under $10", min: 0, max: 1000 },
  { label: "$10 – $15", min: 1000, max: 1500 },
  { label: "$15 – $20", min: 1500, max: 2000 },
  { label: "Over $20", min: 2000, max: Infinity },
] as const;

const BOOKS_PER_PAGE = 9;

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

// ─── Book Card (grid view) ────────────────────────────────────────────────────
function BookCard({
  book,
  onAddToCart,
}: {
  book: Book;
  onAddToCart: (id: string) => void;
}) {
  const t = useTranslations();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(book.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.18)]"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {book.is_bestseller && (
          <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
            {t("catalog.badge.bestseller")}
          </span>
        )}
        {book.is_featured && !book.is_bestseller && (
          <span className="rounded-full bg-[hsl(var(--primary))] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--primary-foreground))]">
            {t("catalog.badge.featured")}
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => setWishlisted((w) => !w)}
        aria-label={t("catalog.wishlist.toggle")}
        className="absolute top-3 right-3 z-10 rounded-full bg-[hsl(var(--background))]/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-[hsl(var(--background))]"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            wishlisted
              ? "fill-rose-500 text-rose-500"
              : "text-[hsl(var(--muted-foreground))]"
          )}
        />
      </button>

      {/* Cover */}
      <Link href={`/books/${book.id}`} className="block overflow-hidden bg-[hsl(var(--muted))]">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://placehold.co/300x420/e8e0d5/7c6f5a?text=${encodeURIComponent(book.title)}`;
          }}
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            {book.genre}
          </span>
          <Link href={`/books/${book.id}`}>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-[hsl(var(--foreground))] hover:text-[var(--accent)] transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
            {book.author}
          </p>
        </div>

        <StarRating rating={book.rating} count={book.review_count} />

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-bold text-[hsl(var(--foreground))]">
            {formatPrice(book.price_cents)}
          </span>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            disabled={book.stock === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              added
                ? "bg-emerald-500 text-white"
                : book.stock === 0
                ? "cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                : "bg-[var(--accent)] text-black hover:brightness-110"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added
              ? t("catalog.card.added")
              : book.stock === 0
              ? t("catalog.card.outOfStock")
              : t("catalog.card.addToCart")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Book Row (list view) ─────────────────────────────────────────────────────
function BookRow({
  book,
  onAddToCart,
}: {
  book: Book;
  onAddToCart: (id: string) => void;
}) {
  const t = useTranslations();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(book.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="flex gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14)]"
    >
      <Link href={`/books/${book.id}`} className="shrink-0">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="h-28 w-20 rounded-xl object-cover shadow-sm"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://placehold.co/160x224/e8e0d5/7c6f5a?text=${encodeURIComponent(book.title)}`;
          }}
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            {book.genre}
          </span>
          <Link href={`/books/${book.id}`}>
            <h3 className="mt-0.5 text-sm font-semibold text-[hsl(var(--foreground))] hover:text-[var(--accent)] transition-colors line-clamp-1">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {book.author}
          </p>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
            {book.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <StarRating rating={book.rating} count={book.review_count} />
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">
              {formatPrice(book.price_cents)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            disabled={book.stock === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              added
                ? "bg-emerald-500 text-white"
                : book.stock === 0
                ? "cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                : "bg-[var(--accent)] text-black hover:brightness-110"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added
              ? t("catalog.card.added")
              : book.stock === 0
              ? t("catalog.card.outOfStock")
              : t("catalog.card.addToCart")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({
  selectedGenres,
  onGenreToggle,
  selectedPriceRange,
  onPriceRangeChange,
  authorQuery,
  onAuthorQueryChange,
  onClearAll,
  activeFilterCount,
}: {
  selectedGenres: Set<string>;
  onGenreToggle: (g: string) => void;
  selectedPriceRange: number | null;
  onPriceRangeChange: (idx: number | null) => void;
  authorQuery: string;
  onAuthorQueryChange: (v: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}) {
  const t = useTranslations();
  const [genreOpen, setGenreOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [authorOpen, setAuthorOpen] = useState(true);

  return (
    <aside className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[hsl(var(--foreground))]" />
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            {t("catalog.filter.title")}
          </span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-black">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            {t("catalog.filter.clearAll")}
          </button>
        )}
      </div>

      {/* Genre */}
      <div className="border-t border-[hsl(var(--border))] pt-4">
        <button
          onClick={() => setGenreOpen((o) => !o)}
          className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))] mb-3"
        >
          {t("catalog.filter.genre")}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform duration-200",
              genreOpen ? "rotate-180" : ""
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {genreOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 pb-2">
                {GENRES.map((genre) => (
                  <label
                    key={genre}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-[hsl(var(--foreground))]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.has(genre)}
                      onChange={() => onGenreToggle(genre)}
                      className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[var(--accent)]"
                    />
                    <span className="leading-none">{genre}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="border-t border-[hsl(var(--border))] pt-4 mt-2">
        <button
          onClick={() => setPriceOpen((o) => !o)}
          className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))] mb-3"
        >
          {t("catalog.filter.price")}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform duration-200",
              priceOpen ? "rotate-180" : ""
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {priceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 pb-2">
                {PRICE_RANGES.map((range, idx) => (
                  <label
                    key={range.label}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-[hsl(var(--foreground))]"
                  >
                    <input
                      type="radio"
                      name="price_range"
                      checked={selectedPriceRange === idx}
                      onChange={() =>
                        onPriceRangeChange(
                          selectedPriceRange === idx ? null : idx
                        )
                      }
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    <span className="leading-none">{range.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Author */}
      <div className="border-t border-[hsl(var(--border))] pt-4 mt-2">
        <button
          onClick={() => setAuthorOpen((o) => !o)}
          className="flex w-full items-center justify-between text-sm font-medium text-[hsl(var(--foreground))] mb-3"
        >
          {t("catalog.filter.author")}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform duration-200",
              authorOpen ? "rotate-180" : ""
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {authorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative pb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={authorQuery}
                  onChange={(e) => onAuthorQueryChange(e.target.value)}
                  placeholder={t("catalog.filter.authorPlaceholder")}
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 pl-8 pr-3 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const t = useTranslations();

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("bestselling");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [authorQuery, setAuthorQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 280);
  const debouncedAuthor = useDebounce(authorQuery, 280);

  // Cart
  const { add: addToCart } = useLocalCart();

  // Genre toggle
  const handleGenreToggle = useCallback((genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
    setCurrentPage(1);
  }, []);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    setSelectedGenres(new Set());
    setSelectedPriceRange(null);
    setAuthorQuery("");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const activeFilterCount =
    selectedGenres.size +
    (selectedPriceRange !== null ? 1 : 0) +
    (debouncedAuthor.trim() ? 1 : 0);

  // Filter + sort
  const filteredBooks = useMemo(() => {
    let books = [...MOCK_BOOKS];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    if (selectedGenres.size > 0) {
      books = books.filter((b) => selectedGenres.has(b.genre));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      books = books.filter(
        (b) => b.price_cents >= range.min && b.price_cents < range.max
      );
    }

    if (debouncedAuthor.trim()) {
      const a = debouncedAuthor.toLowerCase();
      books = books.filter((b) => b.author.toLowerCase().includes(a));
    }

    switch (sortBy) {
      case "bestselling":
        books.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
        break;
      case "newest":
        books.sort((a, b) =>
          (b.publication_date ?? "").localeCompare(a.publication_date ?? "")
        );
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
  }, [debouncedSearch, selectedGenres, selectedPriceRange, debouncedAuthor, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(start, start + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const handleSortChange = (val: string) => {
    setSortBy(val as SortOption);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (idx: number | null) => {
    setSelectedPriceRange(idx);
    setCurrentPage(1);
  };

  const handleAuthorQueryChange = (val: string) => {
    setAuthorQuery(val);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Page Header ── */}
      <Reveal>
        <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("catalog.header.eyebrow")}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
                {t("catalog.header.title")}
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("catalog.header.subtitle")}
              </p>
            </div>

            {/* Search bar */}
            <div className="mt-6 flex max-w-xl items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)]/40 transition-shadow">
              <Search className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("catalog.search.placeholder")}
                className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  aria-label={t("catalog.search.clear")}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <div className="hidden w-64 shrink-0 lg:block">
            <Reveal>
              <FilterPanel
                selectedGenres={selectedGenres}
                onGenreToggle={handleGenreToggle}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={handlePriceRangeChange}
                authorQuery={authorQuery}
                onAuthorQueryChange={handleAuthorQueryChange}
                onClearAll={handleClearAll}
                activeFilterCount={activeFilterCount}
              />
            </Reveal>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setMobileFiltersOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--muted))] lg:hidden"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {t("catalog.toolbar.filters")}
                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-black">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {filteredBooks.length === 1
                      ? t("catalog.toolbar.resultSingular")
                      : t("catalog.toolbar.results", { count: filteredBooks.length })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 pl-3 pr-8 text-xs font-medium text-[hsl(var(--foreground))] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 cursor-pointer"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                  </div>

                  {/* View toggle */}
                  <div className="flex rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-0.5 shadow-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      aria-label={t("catalog.toolbar.gridView")}
                      className={cn(
                        "rounded-md p-1.5 transition-colors",
                        viewMode === "grid"
                          ? "bg-[var(--accent)] text-black"
                          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      )}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      aria-label={t("catalog.toolbar.listView")}
                      className={cn(
                        "rounded-md p-1.5 transition-colors",
                        viewMode === "list"
                          ? "bg-[var(--accent)] text-black"
                          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Mobile filter drawer */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-6 overflow-hidden lg:hidden"
                >
                  <FilterPanel
                    selectedGenres={selectedGenres}
                    onGenreToggle={handleGenreToggle}
                    selectedPriceRange={selectedPriceRange}
                    onPriceRangeChange={handlePriceRangeChange}
                    authorQuery={authorQuery}
                    onAuthorQueryChange={handleAuthorQueryChange}
                    onClearAll={handleClearAll}
                    activeFilterCount={activeFilterCount}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            {(selectedGenres.size > 0 ||
              selectedPriceRange !== null ||
              debouncedAuthor.trim()) && (
              <Reveal>
                <div className="mb-5 flex flex-wrap gap-2">
                  {Array.from(selectedGenres).map((g) => (
                    <button
                      key={g}
                      onClick={() => handleGenreToggle(g)}
                      className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      {g}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedPriceRange !== null && (
                    <button
                      onClick={() => handlePriceRangeChange(null)}
                      className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      {PRICE_RANGES[selectedPriceRange].label}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {debouncedAuthor.trim() && (
                    <button
                      onClick={() => handleAuthorQueryChange("")}
                      className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      {t("catalog.chip.author")}: {debouncedAuthor}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </Reveal>
            )}

            {/* Book grid / list */}
            {paginatedBooks.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] py-20 text-center">
                  <Search className="mb-3 h-10 w-10 text-[hsl(var(--muted-foreground))]" />
                  <p className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {t("catalog.empty.title")}
                  </p>
                  <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    {t("catalog.empty.subtitle")}
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-black hover:brightness-110 transition-all"
                  >
                    {t("catalog.empty.cta")}
                  </button>
                </div>
              </Reveal>
            ) : viewMode === "grid" ? (
              <motion.div
                key={`grid-${currentPage}-${sortBy}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedBooks.map((book) => (
                  <BookCard key={book.id} book={book} onAddToCart={addToCart} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${currentPage}-${sortBy}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {paginatedBooks.map((book) => (
                  <BookRow key={book.id} book={book} onAddToCart={addToCart} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Reveal>
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("catalog.pagination.prev")}
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "h-8 w-8 rounded-lg text-xs font-semibold transition-colors",
                          page === currentPage
                            ? "bg-[var(--accent)] text-black"
                            : "border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("catalog.pagination.next")}
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-[hsl(var(--muted-foreground))]">
                  {t("catalog.pagination.info", {
                    current: currentPage,
                    total: totalPages,
                  })}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}