# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
Build an online bookstore where users can browse books, add them to a cart, and checkout.

## Goal
Build a warm, premium online bookstore with a browsable catalog, book detail pages, shopping cart with localStorage persistence, checkout flow, and order confirmation.

## Project type
e-commerce

## Design system — match this exactly
- Color tokens: `--background: 38 30% 93%`, `--foreground: 234 28% 14%`, `--card: 40 60% 99%`, `--border: 36 25% 80%`, `--muted: 36 22% 88%`, `--muted-foreground: 28 18% 36%`, `--primary: 234 28% 14%`, `--primary-foreground: 38 30% 93%`, `--accent: #c8a96e`

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`bestsellers`, `bestsellers-section`, `bookCard`, `bookDetail`, `cart`, `catalog`, `catalogPromo`, `checkout`, `confirmation`, `cta`, `cta-section`, `featured`, `featured-books-section`, `footer`, `genres`, `hero`, `nav`, `orderConfirmation`, `testimonials`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
