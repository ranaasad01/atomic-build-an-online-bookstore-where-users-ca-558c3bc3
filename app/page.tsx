"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
type getFeaturedBooks = any;
const getFeaturedBooks: any = [];
type getBestsellerBooks = any;
const getBestsellerBooks: any = [];
type formatPrice = any;
const formatPrice: any = [];
type STORE_NAME = any;
const STORE_NAME: any = [];
type STORE_TAGLINE = any;
const STORE_TAGLINE: any = [];
type FREE_SHIPPING_THRESHOLD_CENTS = any;
const FREE_SHIPPING_THRESHOLD_CENTS: any = [];
import Link from "next/link";
import { Star, ArrowRight, Truck, RotateCcw, ShieldCheck, BookOpen, Sparkles, Quote } from 'lucide-react';
import { cn } from "@/lib/utils";

const FEATURED_BOOKS = getFeaturedBooks();
const BESTSELLERS = getBestsellerBooks();

const VALUE_PROPS = [
  {
    icon: Truck,
    titleKey: "valueProps.shipping.title",
    descKey: "valueProps.shipping.desc",
  },
  {
    icon: RotateCcw,
    titleKey: "valueProps.returns.title",
    descKey: "valueProps.returns.desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "valueProps.secure.title",
    descKey: "valueProps.secure.desc",
  },
  {
    icon: BookOpen,
    titleKey: "valueProps.curated.title",
    descKey: "valueProps.curated.desc",
  },
];

const TESTIMONIALS = [
  {
    quote: "The Gilded Page has completely transformed how I discover new books. Every recommendation feels personal and thoughtful.",
    author: "Sarah M.",
    location: "Portland, OR",
    rating: 5,
  },
  {
    quote: "Fast shipping, beautiful packaging, and a selection that actually surprises me. I've found three new favorite authors this year alone.",
    author: "James T.",
    location: "Austin, TX",
    rating: 5,
  },
  {
    quote: "Finally a bookstore that feels like it was built by readers, for readers. The curation is extraordinary.",
    author: "Priya K.",
    location: "Chicago, IL",
    rating: 5,
  },
];

const GENRE_HIGHLIGHTS = [
  { label: "Fiction & Literary", slug: "Fiction & Literary", image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/551fc7d1ae2b4db9971a370235492ef0.jpg", count: "240+ titles" },
  { label: "Mystery & Thriller", slug: "Mystery & Thriller", image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/240a65cd50ad48b7811c3c8064f28e18.webp", count: "180+ titles" },
  { label: "Sci-Fi & Fantasy", slug: "Science Fiction & Fantasy", image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/17a131b388ef47a998ecaa314b822a7a.jpg", count: "210+ titles" },
  { label: "Non-Fiction", slug: "Non-Fiction & Self-Help", image: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/4b65bf1931844ed8a26b366f87b6d01e.jpg", count: "160+ titles" },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.floor(rating) ? "fill-[var(--accent)] text-[var(--accent)]" : "fill-transparent text-[hsl(var(--muted-foreground))]"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-[hsl(var(--muted-foreground))]">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

function BookCard({ book, delay = 0 }: { book: ReturnType<typeof getFeaturedBooks>[number]; delay?: number }) {
  const t = useTranslations();
  return (
    <Reveal delay={delay}>
      <Link href={`/books/${book.id}`} className="group block">
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_16px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-300"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))]">
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {book.is_bestseller && (
              <span className="absolute top-3 left-3 rounded-full bg-[var(--accent)] text-black text-xs font-semibold px-2.5 py-1">
                {t("bookCard.bestseller")}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1 font-medium uppercase tracking-wide">{book.genre}</p>
            <h3 className="font-semibold text-[hsl(var(--foreground))] leading-snug mb-0.5 line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-200">
              {book.title}
            </h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">{book.author}</p>
            <StarRating rating={book.rating} count={book.review_count} />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-[hsl(var(--foreground))]">{formatPrice(book.price_cents)}</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] rounded-full px-2.5 py-1">
                {t("bookCard.inStock")}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </Reveal>
  );
}

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      {/* ── HERO ── */}
      <Reveal>
        <section className="relative overflow-hidden bg-[hsl(var(--background))] pt-16 pb-24 md:pt-24 md:pb-32">
          {/* Subtle radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[600px] w-[900px] rounded-full bg-[var(--accent)]/8 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: copy */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left"
              >
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)] mb-6">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("hero.badge")}
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-[1.05] text-balance mb-6"
                >
                  {t("hero.headline1")}
                  <span className="block text-[var(--accent)]">{t("hero.headline2")}</span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 text-pretty"
                >
                  {t("hero.subheadline")}
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-black font-semibold px-7 py-3.5 text-base hover:bg-[var(--accent)]/90 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  >
                    {t("hero.cta.primary")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] font-medium px-7 py-3.5 text-base hover:bg-[hsl(var(--muted))] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  >
                    {t("hero.cta.secondary")}
                  </Link>
                </motion.div>

                <motion.p variants={fadeInUp} className="mt-5 text-sm text-[hsl(var(--muted-foreground))]">
                  {t("hero.freeShipping", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD_CENTS) })}
                </motion.p>
              </motion.div>

              {/* Right: featured book stack */}
              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                className="relative flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-sm">
                  {/* Background card (offset) */}
                  {FEATURED_BOOKS[1] && (
                    <div className="absolute -top-4 -right-4 w-48 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)] rotate-3 opacity-70">
                      <img
                        src={FEATURED_BOOKS[1].cover_image_url}
                        alt={FEATURED_BOOKS[1].title}
                        className="w-full aspect-[3/4] object-cover"
                      />
                    </div>
                  )}
                  {/* Main card */}
                  {FEATURED_BOOKS[0] && (
                    <Link href={`/books/${FEATURED_BOOKS[0].id}`} className="group relative block z-10">
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.22)] border border-[hsl(var(--border))]"
                      >
                        <img
                          src={FEATURED_BOOKS[0].cover_image_url}
                          alt={FEATURED_BOOKS[0].title}
                          className="w-full aspect-[3/4] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">{t("hero.featuredLabel")}</p>
                          <h2 className="text-white font-bold text-lg leading-snug">{FEATURED_BOOKS[0].title}</h2>
                          <p className="text-white/80 text-sm">{FEATURED_BOOKS[0].author}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <StarRating rating={FEATURED_BOOKS[0].rating} count={FEATURED_BOOKS[0].review_count} />
                            <span className="text-white font-bold">{formatPrice(FEATURED_BOOKS[0].price_cents)}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── VALUE PROPS ── */}
      <Reveal>
        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {VALUE_PROPS.map((vp, i) => {
                const Icon = vp.icon;
                return (
                  <Reveal key={vp.titleKey} delay={i * 0.08}>
                    <div className="flex flex-col items-center text-center gap-3 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-[hsl(var(--foreground))] text-sm">{t(vp.titleKey)}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">{t(vp.descKey)}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FEATURED BOOKS ── */}
      <Reveal>
        <section id="featured" className="py-20 md:py-28 bg-[hsl(var(--background))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">{t("featured.eyebrow")}</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                  {t("featured.heading")}
                </h2>
                <p className="mt-2 text-[hsl(var(--muted-foreground))] max-w-md text-pretty">{t("featured.subheading")}</p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline underline-offset-4 shrink-0"
              >
                {t("featured.viewAll")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {FEATURED_BOOKS.slice(0, 4).map((book, i) => (
                <BookCard key={book.id} book={book} delay={i * 0.07} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── GENRE HIGHLIGHTS ── */}
      <Reveal>
        <section id="genres" className="py-20 md:py-28 bg-[hsl(var(--muted))]/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">{t("genres.eyebrow")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                {t("genres.heading")}
              </h2>
              <p className="mt-2 text-[hsl(var(--muted-foreground))] max-w-lg mx-auto text-pretty">{t("genres.subheading")}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {GENRE_HIGHLIGHTS.map((genre, i) => (
                <Reveal key={genre.slug} delay={i * 0.08}>
                  <Link
                    href={`/catalog?genre=${encodeURIComponent(genre.slug)}`}
                    className="group relative block rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.14)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12),0_16px_40px_-12px_rgba(0,0,0,0.22)] transition-shadow duration-300"
                  >
                    <img
                      src={genre.image}
                      alt={genre.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-base leading-snug">{genre.label}</p>
                      <p className="text-white/70 text-xs mt-0.5">{genre.count}</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="flex items-center gap-1 rounded-full bg-[var(--accent)] text-black text-xs font-semibold px-2.5 py-1">
                        {t("genres.explore")}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── BESTSELLERS ── */}
      <Reveal>
        <section id="bestsellers" className="py-20 md:py-28 bg-[hsl(var(--background))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">{t("bestsellers.eyebrow")}</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                  {t("bestsellers.heading")}
                </h2>
                <p className="mt-2 text-[hsl(var(--muted-foreground))] max-w-md text-pretty">{t("bestsellers.subheading")}</p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline underline-offset-4 shrink-0"
              >
                {t("bestsellers.viewAll")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Asymmetric layout: large card + list */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Large featured bestseller */}
              {BESTSELLERS[0] && (
                <Reveal className="lg:col-span-2">
                  <Link href={`/books/${BESTSELLERS[0].id}`} className="group block h-full">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_16px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-300"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))]">
                        <img
                          src={BESTSELLERS[0].cover_image_url}
                          alt={BESTSELLERS[0].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-[var(--accent)] text-black text-xs font-semibold px-2.5 py-1">
                          {t("bookCard.bestseller")}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1 font-medium uppercase tracking-wide">{BESTSELLERS[0].genre}</p>
                        <h3 className="font-bold text-xl text-[hsl(var(--foreground))] leading-snug mb-1 group-hover:text-[var(--accent)] transition-colors duration-200">
                          {BESTSELLERS[0].title}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">{BESTSELLERS[0].author}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-3 mb-4">{BESTSELLERS[0].description}</p>
                        <StarRating rating={BESTSELLERS[0].rating} count={BESTSELLERS[0].review_count} />
                        <p className="mt-3 text-xl font-bold text-[hsl(var(--foreground))]">{formatPrice(BESTSELLERS[0].price_cents)}</p>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              )}

              {/* List of remaining bestsellers */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                {BESTSELLERS.slice(1, 5).map((book, i) => (
                  <Reveal key={book.id} delay={i * 0.07}>
                    <Link href={`/books/${book.id}`} className="group block">
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.14)] transition-shadow duration-300"
                      >
                        <div className="relative shrink-0 w-16 rounded-lg overflow-hidden bg-[hsl(var(--muted))]">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full aspect-[3/4] object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium uppercase tracking-wide mb-0.5">{book.genre}</p>
                              <h3 className="font-semibold text-[hsl(var(--foreground))] leading-snug group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-1">
                                {book.title}
                              </h3>
                              <p className="text-sm text-[hsl(var(--muted-foreground))]">{book.author}</p>
                            </div>
                            <span className="shrink-0 font-bold text-[hsl(var(--foreground))] text-base">{formatPrice(book.price_cents)}</span>
                          </div>
                          <div className="mt-2">
                            <StarRating rating={book.rating} count={book.review_count} />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── TESTIMONIALS ── */}
      <Reveal>
        <section id="reviews" className="py-20 md:py-28 bg-[hsl(var(--card))] border-y border-[hsl(var(--border))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">{t("testimonials.eyebrow")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                {t("testimonials.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, i) => (
                <Reveal key={testimonial.author} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] flex flex-col gap-4"
                  >
                    <Quote className="h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
                    <p className="text-[hsl(var(--foreground))] leading-relaxed flex-1 text-pretty">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--border))]">
                      <div>
                        <p className="font-semibold text-[hsl(var(--foreground))] text-sm">{testimonial.author}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{testimonial.location}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA BANNER ── */}
      <Reveal>
        <section id="newsletter" className="py-20 md:py-28 bg-[hsl(var(--background))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-[hsl(var(--foreground))] px-8 py-16 md:px-16 md:py-20 text-center">
              {/* Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="h-[400px] w-[700px] rounded-full bg-[var(--accent)]/20 blur-[100px]" />
              </div>

              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">{t("cta.eyebrow")}</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance mb-4">
                  {t("cta.heading")}
                </h2>
                <p className="text-white/70 max-w-xl mx-auto leading-relaxed mb-8 text-pretty">
                  {t("cta.subheading")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-black font-semibold px-8 py-3.5 text-base hover:bg-[var(--accent)]/90 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--foreground))]"
                  >
                    {t("cta.button")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 text-white font-medium px-8 py-3.5 text-base hover:bg-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--foreground))]"
                  >
                    {t("cta.secondary")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}