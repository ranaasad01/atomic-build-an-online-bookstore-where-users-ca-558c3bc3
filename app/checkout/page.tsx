"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShoppingBag, Lock, CreditCard, Truck, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { CartItem } from "@/lib/data";
type FREE_SHIPPING_THRESHOLD_CENTS = any;
const FREE_SHIPPING_THRESHOLD_CENTS: any = [];
type FLAT_SHIPPING_CENTS = any;
const FLAT_SHIPPING_CENTS: any = [];
type EXPRESS_SHIPPING_CENTS = any;
const EXPRESS_SHIPPING_CENTS: any = [];
type US_STATES = any;
const US_STATES: any = [];
type formatPrice = any;
const formatPrice: any = [];
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

type ShippingMethod = "standard" | "express";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const prefix = "TGP";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

// ─── Field Component ──────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, id, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[hsl(var(--foreground))]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 transition-all duration-200";

// ─── Shipping Form ─────────────────────────────────────────────────────────────

interface ShippingFormProps {
  data: ShippingData;
  errors: Partial<ShippingData>;
  onChange: (field: keyof ShippingData, value: string) => void;
}

function ShippingForm({ data, errors, onChange }: ShippingFormProps) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field
          label={t("checkout.shipping.firstName")}
          id="firstName"
          error={errors.firstName}
        >
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Jane"
            className={cn(inputClass, errors.firstName && "border-red-400")}
          />
        </Field>
        <Field
          label={t("checkout.shipping.lastName")}
          id="lastName"
          error={errors.lastName}
        >
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Austen"
            className={cn(inputClass, errors.lastName && "border-red-400")}
          />
        </Field>
      </div>

      <Field
        label={t("checkout.shipping.email")}
        id="email"
        error={errors.email}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="jane@example.com"
          className={cn(inputClass, errors.email && "border-red-400")}
        />
      </Field>

      <Field
        label={t("checkout.shipping.address1")}
        id="address1"
        error={errors.address1}
      >
        <input
          id="address1"
          type="text"
          autoComplete="address-line1"
          value={data.address1}
          onChange={(e) => onChange("address1", e.target.value)}
          placeholder="123 Bookshelf Lane"
          className={cn(inputClass, errors.address1 && "border-red-400")}
        />
      </Field>

      <Field label={t("checkout.shipping.address2")} id="address2">
        <input
          id="address2"
          type="text"
          autoComplete="address-line2"
          value={data.address2}
          onChange={(e) => onChange("address2", e.target.value)}
          placeholder="Apt 4B (optional)"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field
          label={t("checkout.shipping.city")}
          id="city"
          error={errors.city}
        >
          <input
            id="city"
            type="text"
            autoComplete="address-level2"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Brooklyn"
            className={cn(inputClass, errors.city && "border-red-400")}
          />
        </Field>

        <Field
          label={t("checkout.shipping.state")}
          id="state"
          error={errors.state}
        >
          <select
            id="state"
            autoComplete="address-level1"
            value={data.state}
            onChange={(e) => onChange("state", e.target.value)}
            className={cn(inputClass, errors.state && "border-red-400")}
          >
            <option value="">State</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("checkout.shipping.zip")}
          id="zip"
          error={errors.zip}
        >
          <input
            id="zip"
            type="text"
            autoComplete="postal-code"
            value={data.zip}
            onChange={(e) => onChange("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="11201"
            className={cn(inputClass, errors.zip && "border-red-400")}
          />
        </Field>
      </div>

      <Field label={t("checkout.shipping.country")} id="country">
        <select
          id="country"
          autoComplete="country"
          value={data.country}
          onChange={(e) => onChange("country", e.target.value)}
          className={inputClass}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Payment Form ─────────────────────────────────────────────────────────────

interface PaymentFormProps {
  data: PaymentData;
  errors: Partial<PaymentData>;
  onChange: (field: keyof PaymentData, value: string) => void;
}

function PaymentForm({ data, errors, onChange }: PaymentFormProps) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5">
      <Field
        label={t("checkout.payment.nameOnCard")}
        id="nameOnCard"
        error={errors.nameOnCard}
      >
        <input
          id="nameOnCard"
          type="text"
          autoComplete="cc-name"
          value={data.nameOnCard}
          onChange={(e) => onChange("nameOnCard", e.target.value)}
          placeholder="Jane Austen"
          className={cn(inputClass, errors.nameOnCard && "border-red-400")}
        />
      </Field>

      <Field
        label={t("checkout.payment.cardNumber")}
        id="cardNumber"
        error={errors.cardNumber}
      >
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            autoComplete="cc-number"
            inputMode="numeric"
            value={data.cardNumber}
            onChange={(e) =>
              onChange("cardNumber", formatCardNumber(e.target.value))
            }
            placeholder="4242 4242 4242 4242"
            className={cn(
              inputClass,
              "pr-12",
              errors.cardNumber && "border-red-400"
            )}
          />
          <CreditCard
            className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]"
            aria-hidden="true"
          />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label={t("checkout.payment.expiry")}
          id="expiry"
          error={errors.expiry}
        >
          <input
            id="expiry"
            type="text"
            autoComplete="cc-exp"
            inputMode="numeric"
            value={data.expiry}
            onChange={(e) => onChange("expiry", formatExpiry(e.target.value))}
            placeholder="MM/YY"
            className={cn(inputClass, errors.expiry && "border-red-400")}
          />
        </Field>

        <Field
          label={t("checkout.payment.cvv")}
          id="cvv"
          error={errors.cvv}
        >
          <input
            id="cvv"
            type="text"
            autoComplete="cc-csc"
            inputMode="numeric"
            value={data.cvv}
            onChange={(e) =>
              onChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="123"
            className={cn(inputClass, errors.cvv && "border-red-400")}
          />
        </Field>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 px-4 py-3">
        <Lock className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" aria-hidden="true" />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          {t("checkout.payment.secureNote")}
        </p>
      </div>
    </div>
  );
}

// ─── Shipping Method Selector ─────────────────────────────────────────────────

interface ShippingMethodProps {
  selected: ShippingMethod;
  subtotal: number;
  onChange: (method: ShippingMethod) => void;
}

function ShippingMethodSelector({
  selected,
  subtotal,
  onChange,
}: ShippingMethodProps) {
  const t = useTranslations();
  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;

  const options: {
    id: ShippingMethod;
    label: string;
    detail: string;
    cost: number | null;
  }[] = [
    {
      id: "standard",
      label: t("checkout.shippingMethod.standardLabel"),
      detail: t("checkout.shippingMethod.standardDetail"),
      cost: qualifiesFree ? null : FLAT_SHIPPING_CENTS,
    },
    {
      id: "express",
      label: t("checkout.shippingMethod.expressLabel"),
      detail: t("checkout.shippingMethod.expressDetail"),
      cost: EXPRESS_SHIPPING_CENTS,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
            selected === opt.id
              ? "border-[var(--accent)] bg-[var(--accent)]/8 ring-1 ring-[var(--accent)]/40"
              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/50"
          )}
          aria-pressed={selected === opt.id}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selected === opt.id
                  ? "border-[var(--accent)] bg-[var(--accent)]"
                  : "border-[hsl(var(--border))]"
              )}
            >
              {selected === opt.id && (
                <Check className="h-3 w-3 text-black" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                {opt.label}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {opt.detail}
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            {opt.cost === null ? t("checkout.shippingMethod.free") : formatPrice(opt.cost)}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Order Summary Panel ──────────────────────────────────────────────────────

interface OrderSummaryProps {
  items: CartItem[];
  shippingMethod: ShippingMethod;
}

function OrderSummaryCheckout({ items, shippingMethod }: OrderSummaryProps) {
  const t = useTranslations();

  const subtotal = useMemo(
    () => items.reduce((sum, ci) => sum + ci.book.price_cents * ci.quantity, 0),
    [items]
  );

  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCost =
    shippingMethod === "express"
      ? EXPRESS_SHIPPING_CENTS
      : qualifiesFree
      ? 0
      : FLAT_SHIPPING_CENTS;

  const taxCents = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + taxCents;

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
            {t("checkout.summary.title")}
          </h2>
        </div>
      </div>

      {/* Line items */}
      <div className="flex flex-col divide-y divide-[hsl(var(--border))] px-6">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            {t("checkout.summary.empty")}
          </p>
        ) : (
          items.map((ci) => (
            <div key={ci.book.id} className="flex items-start gap-3 py-4">
              <div className="relative shrink-0">
                <img
                  src={ci.book.cover_image_url}
                  alt={ci.book.title}
                  className="h-16 w-12 rounded-lg object-cover shadow-sm ring-1 ring-black/10"
                />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--muted-foreground))] text-[10px] font-bold text-white">
                  {ci.quantity}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                  {ci.book.title}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {ci.book.author}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-[hsl(var(--foreground))]">
                {formatPrice(ci.book.price_cents * ci.quantity)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-[hsl(var(--border))] px-6 py-5 flex flex-col gap-3">
        <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
          <span>{t("checkout.summary.subtotal")}</span>
          <span className="font-medium text-[hsl(var(--foreground))]">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
          <span>{t("checkout.summary.shipping")}</span>
          <span className="font-medium text-[hsl(var(--foreground))]">
            {shippingCost === 0
              ? t("checkout.summary.free")
              : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
          <span>{t("checkout.summary.tax")}</span>
          <span className="font-medium text-[hsl(var(--foreground))]">
            {formatPrice(taxCents)}
          </span>
        </div>
        <div className="mt-1 flex justify-between border-t border-[hsl(var(--border))] pt-3">
          <span className="text-base font-bold text-[hsl(var(--foreground))]">
            {t("checkout.summary.total")}
          </span>
          <span className="text-base font-bold text-[var(--accent)]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-6 py-4">
        <div className="flex flex-col gap-2">
          {[
            { icon: Lock, text: t("checkout.trust.secure") },
            { icon: Truck, text: t("checkout.trust.shipping") },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const EMPTY_SHIPPING: ShippingData = {
  firstName: "",
  lastName: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const EMPTY_PAYMENT: PaymentData = {
  cardNumber: "",
  expiry: "",
  cvv: "",
  nameOnCard: "",
};

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingData, setShippingData] = useState<ShippingData>(EMPTY_SHIPPING);
  const [paymentData, setPaymentData] = useState<PaymentData>(EMPTY_PAYMENT);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingData>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setCartItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, ci) => sum + ci.book.price_cents * ci.quantity,
        0
      ),
    [cartItems]
  );

  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCost =
    shippingMethod === "express"
      ? EXPRESS_SHIPPING_CENTS
      : qualifiesFree
      ? 0
      : FLAT_SHIPPING_CENTS;
  const taxCents = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + taxCents;

  function validateShipping(): boolean {
    const errs: Partial<ShippingData> = {};
    if (!shippingData.firstName.trim()) errs.firstName = "Required";
    if (!shippingData.lastName.trim()) errs.lastName = "Required";
    if (!shippingData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email))
      errs.email = "Valid email required";
    if (!shippingData.address1.trim()) errs.address1 = "Required";
    if (!shippingData.city.trim()) errs.city = "Required";
    if (!shippingData.state) errs.state = "Required";
    if (!shippingData.zip || shippingData.zip.length < 5) errs.zip = "5-digit ZIP required";
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validatePayment(): boolean {
    const errs: Partial<PaymentData> = {};
    const rawCard = paymentData.cardNumber.replace(/\s/g, "");
    if (!paymentData.nameOnCard.trim()) errs.nameOnCard = "Required";
    if (rawCard.length < 16) errs.cardNumber = "Valid 16-digit card number required";
    if (!paymentData.expiry || paymentData.expiry.length < 5) errs.expiry = "MM/YY required";
    if (!paymentData.cvv || paymentData.cvv.length < 3) errs.cvv = "3-4 digit CVV required";
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleShippingContinue() {
    if (validateShipping()) {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise((res) => setTimeout(res, 1200));

    const orderNumber = generateOrderNumber();
    const orderData = {
      orderNumber,
      items: cartItems,
      shipping: shippingData,
      shippingMethod,
      subtotal,
      shippingCost,
      taxCents,
      total,
      placedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      localStorage.removeItem("cart");
    } catch {
      // ignore storage errors
    }

    router.push(`/order-confirmation?order=${orderNumber}`);
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-24 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <Reveal>
          <div className="mb-10">
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-3">
              <span>{t("checkout.breadcrumb.cart")}</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span
                className={cn(
                  "font-medium",
                  step === "shipping"
                    ? "text-[var(--accent)]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                {t("checkout.breadcrumb.shipping")}
              </span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span
                className={cn(
                  "font-medium",
                  step === "payment"
                    ? "text-[var(--accent)]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                {t("checkout.breadcrumb.payment")}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
              {t("checkout.heading")}
            </h1>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              {t("checkout.subheading")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left column — forms */}
          <div className="flex flex-col gap-8">
            {/* Shipping section */}
            <Reveal>
              <section
                aria-labelledby="shipping-heading"
                className={cn(
                  "rounded-2xl border bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300",
                  step === "payment"
                    ? "border-[hsl(var(--border))] opacity-70"
                    : "border-[hsl(var(--border))]"
                )}
              >
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                        step === "payment"
                          ? "bg-[var(--accent)] text-black"
                          : "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
                      )}
                    >
                      {step === "payment" ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        "1"
                      )}
                    </div>
                    <h2
                      id="shipping-heading"
                      className="text-base font-semibold text-[hsl(var(--foreground))]"
                    >
                      {t("checkout.shipping.heading")}
                    </h2>
                  </div>
                  {step === "payment" && (
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="text-xs font-medium text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      {t("checkout.shipping.edit")}
                    </button>
                  )}
                </div>

                {step === "shipping" ? (
                  <div className="px-6 py-6 flex flex-col gap-6">
                    <ShippingForm
                      data={shippingData}
                      errors={shippingErrors}
                      onChange={(field, value) =>
                        setShippingData((prev) => ({ ...prev, [field]: value }))
                      }
                    />

                    <div>
                      <p className="mb-3 text-sm font-medium text-[hsl(var(--foreground))]">
                        {t("checkout.shippingMethod.heading")}
                      </p>
                      <ShippingMethodSelector
                        selected={shippingMethod}
                        subtotal={subtotal}
                        onChange={setShippingMethod}
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleShippingContinue}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-black shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                    >
                      {t("checkout.shipping.continue")}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {shippingData.firstName} {shippingData.lastName} &bull;{" "}
                      {shippingData.address1}, {shippingData.city},{" "}
                      {shippingData.state} {shippingData.zip}
                    </p>
                  </div>
                )}
              </section>
            </Reveal>

            {/* Payment section */}
            <Reveal delay={0.08}>
              <section
                aria-labelledby="payment-heading"
                className={cn(
                  "rounded-2xl border bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300",
                  step === "shipping"
                    ? "border-[hsl(var(--border))] opacity-50 pointer-events-none"
                    : "border-[hsl(var(--border))]"
                )}
              >
                <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-6 py-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-xs font-bold text-[hsl(var(--background))]">
                    2
                  </div>
                  <h2
                    id="payment-heading"
                    className="text-base font-semibold text-[hsl(var(--foreground))]"
                  >
                    {t("checkout.payment.heading")}
                  </h2>
                </div>

                {step === "payment" && (
                  <form onSubmit={handlePlaceOrder} noValidate>
                    <div className="px-6 py-6 flex flex-col gap-6">
                      <PaymentForm
                        data={paymentData}
                        errors={paymentErrors}
                        onChange={(field, value) =>
                          setPaymentData((prev) => ({ ...prev, [field]: value }))
                        }
                      />

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={isSubmitting ? {} : { scale: 1.01 }}
                        whileTap={isSubmitting ? {} : { scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-black shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            {t("checkout.payment.processing")}
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" aria-hidden="true" />
                            {t("checkout.payment.placeOrder")} &bull; {formatPrice(total)}
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
                        {t("checkout.payment.disclaimer")}
                      </p>
                    </div>
                  </form>
                )}
              </section>
            </Reveal>
          </div>

          {/* Right column — order summary */}
          <Reveal delay={0.12} className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummaryCheckout
              items={cartItems}
              shippingMethod={shippingMethod}
            />
          </Reveal>
        </div>
      </div>
    </main>
  );
}