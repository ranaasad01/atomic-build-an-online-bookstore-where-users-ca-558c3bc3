export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Browse Books", href: "/catalog", key: "catalog" },
  { label: "Cart", href: "/cart", key: "cart" },
];

export const BRAND = {
  name: "The Gilded Page",
  tagline: "Stories Worth Losing Yourself In",
  email: "hello@thegildedpage.com",
  shipping_threshold: 35,
  currency: "USD",
} as const;

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  price_cents: number;
  cover_image_url: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  stock: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderAddress {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const GENRES = [
  "Fiction & Literary",
  "Mystery & Thriller",
  "Science Fiction & Fantasy",
  "Non-Fiction & Self-Help",
  "Children & Young Adult",
  "Historical Fiction",
] as const;

export type Genre = (typeof GENRES)[number];