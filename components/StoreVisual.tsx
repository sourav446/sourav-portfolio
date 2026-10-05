"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronRight,
  CreditCard,
  Heart,
  Landmark,
  Loader2,
  Lock,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Star,
} from "lucide-react";
import { EASE } from "@/components/motion/Reveal";

/**
 * Decorative demo of the XL1 Super Sports store (xcell1.com), in its own look: red top bar,
 * red/navy logo, navy buttons, white product cards with struck-through prices.
 * Walks the real shopping flow: search → product list → product page → cart → payment.
 * Product names and prices are from the live site; emoji stand in for photos.
 */

const XL1 = {
  red: "#c10007", // Tailwind red-700, the site's top bar
  navy: "#1e2a5e",
  ink: "#101828",
  muted: "#364153",
  soft: "#f6f6f7",
};

type Product = { name: string; emoji: string; mrp: number; price: number };

// "cricket" results, as listed on xcell1.com
const RESULTS: Product[] = [
  { name: "SS Master 500 English Willow Cricket Bat", emoji: "🏏", mrp: 12900, price: 10965 },
  { name: "DSC Intense Spirit Kashmir Willow Bat", emoji: "🏏", mrp: 3799, price: 3419 },
  { name: "SS Match Cricket Batting Gloves", emoji: "🧤", mrp: 1610, price: 1449 },
  { name: "DSC Bouncer Cricket Helmet", emoji: "⛑️", mrp: 1499, price: 1349 },
  { name: "DSC Pro X Cricket Batting Leggaurd", emoji: "🦵", mrp: 3875, price: 3488 },
  { name: "DSC Jaffa 22 Cricket Shoes (Green)", emoji: "👟", mrp: 1929, price: 1736 },
];
const HERO = RESULTS[0];
const IN_CART = RESULTS[2]; // already in the cart before this visit

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const off = (p: Product) => Math.round((1 - p.price / p.mrp) * 100);

type Scene = "search" | "list" | "product" | "cart" | "payment";
const SCENES: { id: Scene; label: string; ms: number }[] = [
  { id: "search", label: "Search", ms: 3400 },
  { id: "list", label: "Products", ms: 3600 },
  { id: "product", label: "Product", ms: 4400 },
  { id: "cart", label: "Cart", ms: 3600 },
  { id: "payment", label: "Payment", ms: 5600 },
];

/* ── Fake cursor: glides to a target, then presses ──────────────────────── */
function Cursor({
  from,
  to,
  delay,
  duration = 0.9,
}: {
  from: [number, number];
  to: [number, number];
  delay: number;
  duration?: number;
}) {
  return (
    <motion.span
      className="pointer-events-none absolute z-30"
      initial={{ left: `${from[0]}%`, top: `${from[1]}%`, opacity: 0 }}
      animate={{
        left: `${to[0]}%`,
        top: `${to[1]}%`,
        opacity: 1,
        scale: [1, 1, 0.8, 1],
      }}
      transition={{
        left: { duration, ease: EASE, delay },
        top: { duration, ease: EASE, delay },
        opacity: { duration: 0.2, delay },
        scale: { duration: 0.35, delay: delay + duration, times: [0, 0.3, 0.6, 1] },
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
        <path d="M4 2l16 9.5-7 1.6-3.6 6.9L4 2z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      {/* click ripple */}
      <motion.span
        className="absolute -top-1.5 -left-1.5 h-4 w-4 rounded-full border-2"
        style={{ borderColor: XL1.red }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.6], opacity: [0.9, 0] }}
        transition={{ duration: 0.5, delay: delay + duration + 0.05 }}
      />
    </motion.span>
  );
}

function Stars({ size = "h-1.5 w-1.5", filled = 0 }: { size?: string; filled?: number }) {
  return (
    <span className="flex items-center gap-px">
      {[0, 1, 2, 3, 4].map((s) => (
        <Star key={s} className={size} fill={s < filled ? "#f59e0b" : "none"} color={s < filled ? "#f59e0b" : "rgba(0,0,0,0.2)"} />
      ))}
    </span>
  );
}

/* ── 1 · Search: type a query, suggestions drop down, pick one ──────────── */
function SearchScene() {
  const query = "cricket";
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    let tick: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      tick = setInterval(() => setTyped((n) => Math.min(n + 1, query.length)), 110);
    }, 350);
    return () => {
      clearTimeout(start);
      clearInterval(tick);
    };
  }, []);
  const done = typed >= query.length;
  const suggestions = ["cricket bat", "cricket helmet", "cricket shoes", "cricket kitbag"];

  return (
    <div className="relative flex h-full flex-col items-center pt-5">
      <p className="text-[11px] font-bold" style={{ color: XL1.ink }}>
        What are you playing today?
      </p>
      <div className="relative mt-2.5 w-[86%]">
        <div
          className="flex items-center gap-1.5 rounded-full border-2 bg-white py-1 pr-1 pl-2.5 transition-colors"
          style={{ borderColor: done ? XL1.navy : "rgba(0,0,0,0.15)" }}
        >
          <Search className="h-3 w-3 text-black/40" />
          <span className="flex-1 text-[10px]" style={{ color: XL1.ink }}>
            {typed === 0 ? (
              <span className="text-black/35">Search bats, gloves, shoes…</span>
            ) : (
              query.slice(0, typed)
            )}
            <span className="ml-px inline-block h-2.5 w-px translate-y-0.5 animate-pulse bg-black/60" />
          </span>
          <span className="rounded-full px-2.5 py-1 text-[8px] font-semibold text-white" style={{ background: XL1.red }}>
            Search
          </span>
        </div>

        <AnimatePresence>
          {done && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-2 top-full mt-1 overflow-hidden rounded-md border border-black/10 bg-white shadow-lg"
            >
              {suggestions.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, backgroundColor: i === 0 ? ["#ffffff", "#ffffff", "#eef0f7"] : "#ffffff" }}
                  transition={{ delay: 0.1 + i * 0.06, backgroundColor: { delay: 1.3, duration: 0.3 } }}
                  className="flex items-center gap-1.5 px-2 py-1 text-[8.5px]"
                  style={{ color: XL1.ink }}
                >
                  <Search className="h-2 w-2 text-black/35" />
                  <span>
                    <b>cricket</b>
                    {s.slice(7)}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <Cursor from={[80, 95]} to={[30, 47]} delay={1.0} />
    </div>
  );
}

/* ── 2 · Product list: results grid with filters; open the first product ── */
function ListCard({ p, i, pick }: { p: Product; i: number; pick: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: pick ? ["0 0 0 0px #c10007", "0 0 0 0px #c10007", "0 0 0 2px #c10007"] : "0 0 0 0px #c10007",
      }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.07, boxShadow: { delay: 1.9, duration: 0.3 } }}
      className="relative flex flex-col overflow-hidden rounded-md border border-black/10 bg-white"
    >
      <span className="absolute top-1 left-1 rounded bg-[#c10007] px-1 text-[6.5px] font-bold text-white">{off(p)}% OFF</span>
      <Heart className="absolute top-1 right-1 h-2 w-2 text-black/30" />
      <div className="flex h-9 items-center justify-center text-xl sm:h-10 sm:text-2xl" style={{ background: XL1.soft }}>
        {p.emoji}
      </div>
      <div className="flex flex-col gap-0.5 p-1">
        <p className="line-clamp-1 text-[7.5px] font-medium" style={{ color: XL1.ink }}>
          {p.name}
        </p>
        <p className="flex items-baseline gap-1">
          <span className="text-[6.5px] line-through" style={{ color: XL1.muted }}>
            {inr(p.mrp)}
          </span>
          <span className="text-[8.5px] font-bold" style={{ color: XL1.ink }}>
            {inr(p.price)}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

function ListScene() {
  return (
    <div className="relative flex h-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[9px]" style={{ color: XL1.muted }}>
          <b style={{ color: XL1.ink }}>Results for “cricket”</b> · {RESULTS.length} products
        </p>
        <span className="flex items-center gap-1 text-[7.5px]" style={{ color: XL1.muted }}>
          <SlidersHorizontal className="h-2 w-2" /> Sort: Popular
        </span>
      </div>
      <div className="flex gap-1">
        {["Cricket", "Bats", "Under ₹15,000", "In stock"].map((c, i) => (
          <span
            key={c}
            className="flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[7px]"
            style={{
              borderColor: i === 0 ? XL1.red : "rgba(0,0,0,0.12)",
              background: i === 0 ? "rgba(193,0,7,0.08)" : "white",
              color: i === 0 ? XL1.red : XL1.muted,
              fontWeight: i === 0 ? 600 : 400,
            }}
          >
            {i === 0 && <Check className="h-1.5 w-1.5" />}
            {c}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-3 content-start gap-1.5">
        {RESULTS.map((p, i) => (
          <ListCard key={p.name} p={p} i={i} pick={i === 0} />
        ))}
      </div>
      <Cursor from={[70, 90]} to={[16, 34]} delay={1.0} />
    </div>
  );
}

/* ── 3 · Product page: details, quantity, add to cart ───────────────────── */
function ProductScene({ onAdd }: { onAdd: () => void }) {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setAdded(true);
      onAdd();
    }, 2200);
    return () => clearTimeout(t);
  }, [onAdd]);

  return (
    <div className="relative flex h-full flex-col gap-1.5">
      <p className="flex items-center gap-0.5 text-[7px]" style={{ color: XL1.muted }}>
        Home <ChevronRight className="h-1.5 w-1.5" /> Cricket <ChevronRight className="h-1.5 w-1.5" />
        <span style={{ color: XL1.ink }}>Bats</span>
      </p>
      <div className="grid flex-1 grid-cols-[44%_1fr] gap-2.5">
        {/* Gallery */}
        <div className="flex flex-col gap-1">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex flex-1 items-center justify-center rounded-md border border-black/10 text-[56px] sm:text-[76px]"
            style={{ background: XL1.soft }}
          >
            <span className="absolute top-1 left-1 rounded bg-[#c10007] px-1 text-[7px] font-bold text-white">{off(HERO)}% OFF</span>
            <span className="-rotate-45">{HERO.emoji}</span>
          </motion.div>
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((t) => (
              <span
                key={t}
                className="flex h-6 items-center justify-center rounded border text-sm"
                style={{ background: XL1.soft, borderColor: t === 0 ? XL1.navy : "rgba(0,0,0,0.1)" }}
              >
                <span className={t === 1 ? "rotate-45" : t === 2 ? "rotate-90" : "-rotate-45"}>{HERO.emoji}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="flex flex-col gap-1"
        >
          <span className="text-[7px] font-bold tracking-wider" style={{ color: XL1.red }}>
            SS
          </span>
          <p className="text-[10px] leading-tight font-bold" style={{ color: XL1.ink }}>
            {HERO.name}
          </p>
          <Stars size="h-2 w-2" />
          <p className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-[13px] font-black" style={{ color: XL1.ink }}>
              {inr(HERO.price)}
            </span>
            <span className="text-[8px] line-through" style={{ color: XL1.muted }}>
              {inr(HERO.mrp)}
            </span>
            <span className="text-[8px] font-bold text-green-700">{off(HERO)}% off</span>
          </p>
          <p className="text-[6.5px]" style={{ color: XL1.muted }}>
            Inclusive of all taxes
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[7.5px]" style={{ color: XL1.muted }}>
              Qty
            </span>
            <span className="flex items-center rounded border border-black/15 text-[8px]" style={{ color: XL1.ink }}>
              <Minus className="mx-1 h-2 w-2 text-black/40" />
              <span className="border-x border-black/15 px-1.5 font-semibold">1</span>
              <Plus className="mx-1 h-2 w-2 text-black/40" />
            </span>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-1">
            <motion.span
              className="flex items-center justify-center gap-1 rounded py-1.5 text-[8px] font-semibold text-white"
              animate={{ background: added ? "#16a34a" : XL1.navy, scale: added ? [0.92, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {added ? (
                <>
                  <Check className="h-2.5 w-2.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-2.5 w-2.5" /> Add to cart
                </>
              )}
            </motion.span>
            <span className="flex items-center justify-center rounded py-1.5 text-[8px] font-semibold text-white" style={{ background: XL1.red }}>
              Buy now
            </span>
          </div>
        </motion.div>
      </div>

      {/* Product flies to the cart */}
      <AnimatePresence>
        {added && (
          <motion.span
            initial={{ opacity: 1, left: "62%", top: "78%", scale: 1 }}
            animate={{ opacity: 0, left: "93%", top: "-22%", scale: 0.35 }}
            transition={{ duration: 0.8, ease: [0.5, 0, 0.75, 0] }}
            className="pointer-events-none absolute z-20 text-2xl"
          >
            {HERO.emoji}
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {added && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-md bg-[#101828] px-2 py-1 text-[8px] whitespace-nowrap text-white shadow-lg"
          >
            <Check className="h-2.5 w-2.5 text-green-400" /> Added to cart
          </motion.span>
        )}
      </AnimatePresence>
      <Cursor from={[30, 20]} to={[64, 90]} delay={1.0} />
    </div>
  );
}

/* ── 4 · Cart: items, quantities, total ─────────────────────────────────── */
function CartScene() {
  const items = [HERO, IN_CART];
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const savings = items.reduce((s, p) => s + (p.mrp - p.price), 0);

  return (
    <div className="relative flex h-full gap-2">
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-[10px] font-bold" style={{ color: XL1.ink }}>
          My Cart <span className="font-normal" style={{ color: XL1.muted }}>({items.length} items)</span>
        </p>
        {items.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.1 + i * 0.1 }}
            className="flex items-center gap-1.5 rounded-md border border-black/10 bg-white p-1.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-lg" style={{ background: XL1.soft }}>
              {p.emoji}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="line-clamp-1 text-[7.5px] font-medium" style={{ color: XL1.ink }}>
                {p.name}
              </span>
              <span className="flex items-center rounded border border-black/15 text-[7px] w-fit" style={{ color: XL1.ink }}>
                <Minus className="mx-0.5 h-1.5 w-1.5 text-black/40" />
                <span className="border-x border-black/15 px-1 font-semibold">1</span>
                <Plus className="mx-0.5 h-1.5 w-1.5 text-black/40" />
              </span>
            </span>
            <span className="flex flex-col items-end">
              <span className="text-[8.5px] font-bold" style={{ color: XL1.ink }}>
                {inr(p.price)}
              </span>
              <span className="text-[6.5px] line-through" style={{ color: XL1.muted }}>
                {inr(p.mrp)}
              </span>
            </span>
          </motion.div>
        ))}
      </div>

      {/* Order summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
        className="flex w-[38%] flex-col gap-1 self-start rounded-md border border-black/10 bg-white p-1.5 text-[7.5px]"
        style={{ color: XL1.ink }}
      >
        <p className="text-[8.5px] font-bold">Order summary</p>
        <p className="flex justify-between" style={{ color: XL1.muted }}>
          <span>Subtotal</span>
          <span>{inr(subtotal)}</span>
        </p>
        <p className="flex justify-between text-green-700">
          <span>You save</span>
          <span>{inr(savings)}</span>
        </p>
        <p className="flex justify-between border-t border-black/10 pt-1 text-[9px] font-bold">
          <span>Total</span>
          <span>{inr(subtotal)}</span>
        </p>
        <span className="mt-0.5 flex justify-center rounded py-1 text-[7.5px] font-semibold text-white" style={{ background: XL1.navy }}>
          Proceed to checkout
        </span>
      </motion.div>
      <Cursor from={[30, 80]} to={[82, 72]} delay={1.4} />
    </div>
  );
}

/* ── 5 · Payment: pick a method, pay via CCAvenue, order placed ─────────── */
function PaymentScene() {
  const [stage, setStage] = useState<"choose" | "paying" | "done">("choose");
  useEffect(() => {
    const a = setTimeout(() => setStage("paying"), 2300);
    const b = setTimeout(() => setStage("done"), 3600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  const total = HERO.price + IN_CART.price;
  const methods = [
    { label: "UPI", note: "GPay, PhonePe, Paytm", Icon: Smartphone },
    { label: "Credit / Debit Card", note: "Visa, Mastercard, RuPay", Icon: CreditCard },
    { label: "Net Banking", note: "All major banks", Icon: Landmark },
  ];

  return (
    <div className="relative h-full">
      <AnimatePresence initial={false}>
        {stage === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-[0_0_0_6px_rgba(22,163,74,0.15)]"
            >
              <Check className="h-5 w-5" />
            </motion.span>
            <p className="text-[12px] font-black" style={{ color: XL1.ink }}>
              Payment successful
            </p>
            <p className="text-[8.5px]" style={{ color: XL1.muted }}>
              {inr(total)} paid · Order placed
            </p>
            <span className="mt-1 flex items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-0.5 text-[8px]" style={{ color: XL1.ink }}>
              <Package className="h-2.5 w-2.5" /> Track it in My Orders
            </span>
          </motion.div>
        ) : (
          <motion.div key="choose" exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0 flex gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <p className="flex items-center gap-1 text-[8px]" style={{ color: XL1.muted }}>
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-green-600 text-white">
                  <Check className="h-2 w-2" />
                </span>
                Delivery address saved
              </p>
              <p className="text-[10px] font-bold" style={{ color: XL1.ink }}>
                Choose payment method
              </p>
              {methods.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-1.5 rounded-md border bg-white px-1.5 py-1"
                  style={{ borderColor: i === 0 ? XL1.navy : "rgba(0,0,0,0.1)" }}
                >
                  <span
                    className="flex h-2.5 w-2.5 items-center justify-center rounded-full border"
                    style={{ borderColor: i === 0 ? XL1.navy : "rgba(0,0,0,0.3)" }}
                  >
                    {i === 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: XL1.navy }} />}
                  </span>
                  <m.Icon className="h-2.5 w-2.5" style={{ color: XL1.navy }} />
                  <span className="flex flex-col">
                    <span className="text-[8px] font-semibold" style={{ color: XL1.ink }}>
                      {m.label}
                    </span>
                    <span className="text-[6.5px]" style={{ color: XL1.muted }}>
                      {m.note}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex w-[38%] flex-col gap-1 self-start rounded-md border border-black/10 bg-white p-1.5 text-[7.5px]" style={{ color: XL1.ink }}>
              <p className="text-[8.5px] font-bold">Amount payable</p>
              <p className="text-[13px] font-black">{inr(total)}</p>
              <span
                className="mt-0.5 flex items-center justify-center gap-1 rounded py-1 text-[8px] font-semibold text-white"
                style={{ background: XL1.red }}
              >
                {stage === "paying" ? (
                  <>
                    <Loader2 className="h-2.5 w-2.5 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Lock className="h-2.5 w-2.5" /> Pay {inr(total)}
                  </>
                )}
              </span>
              <p className="flex items-center justify-center gap-0.5 text-[6.5px]" style={{ color: XL1.muted }}>
                <Lock className="h-1.5 w-1.5" /> Secured by CCAvenue
              </p>
            </div>
            <Cursor from={[20, 85]} to={[80, 44]} delay={1.2} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StoreVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [cartCount, setCartCount] = useState(1);

  // Each step runs for its own length, then the flow moves on (and loops).
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => setScene((n) => (n + 1) % SCENES.length), SCENES[scene].ms);
    return () => clearTimeout(t);
  }, [scene, inView, reduce]);

  // Cart badge: 1 item (gloves) until the bat is added; resets when the flow restarts.
  const active = SCENES[scene].id;
  useEffect(() => {
    if (active === "search") setCartCount(1);
  }, [active]);
  const bump = useRef(() => setCartCount(2)).current;

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg bg-[#f3f4f6] ring-1 ring-black/10"
    >
      {/* Red top strip */}
      <div className="flex items-center justify-between px-2.5 py-1 text-[8px] text-white" style={{ background: XL1.red }}>
        <span>Sports Gear &amp; Equipment Online</span>
        <span>xcell1.com</span>
      </div>

      {/* Header: logo · wishlist / orders / cart */}
      <div className="flex items-center gap-2 border-b border-black/10 bg-white px-2.5 py-1.5">
        <span className="leading-none">
          <span className="block text-[11px] font-black tracking-tight" style={{ color: XL1.red }}>
            XL1 <span style={{ color: XL1.navy }}>SUPER SPORTS</span>
          </span>
          <span className="block text-[5.5px] font-semibold tracking-widest text-black/50">A PROMISE OF TRUTH</span>
        </span>
        <span className="ml-auto flex items-center gap-2.5 text-[8px]" style={{ color: XL1.ink }}>
          <span className="hidden items-center gap-0.5 sm:flex">
            <Heart className="h-2.5 w-2.5" /> Wishlist
          </span>
          <span className="flex items-center gap-0.5">
            <Package className="h-2.5 w-2.5" /> Orders
          </span>
          <span className="relative flex items-center gap-0.5">
            <ShoppingCart className="h-3 w-3" />
            <motion.span
              key={cartCount}
              initial={{ scale: 1.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="absolute -top-1.5 left-2 flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[6.5px] font-bold text-white"
              style={{ background: XL1.red }}
            >
              {cartCount}
            </motion.span>
            Cart
          </span>
        </span>
      </div>

      {/* Page */}
      <div className="relative flex-1 p-2.5">
        <div className="relative h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0"
            >
              {active === "search" && <SearchScene />}
              {active === "list" && <ListScene />}
              {active === "product" && <ProductScene onAdd={bump} />}
              {active === "cart" && <CartScene />}
              {active === "payment" && <PaymentScene />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step indicator — the active step shows its label and a progress fill */}
      <div className="flex items-center justify-center gap-1 border-t border-black/10 bg-white px-1.5 py-1.5">
        {SCENES.map((s, i) => {
          const on = i === scene;
          const past = i < scene;
          return (
            <span key={s.id} className="flex items-center gap-1">
              <span
                className="relative flex items-center gap-1 overflow-hidden rounded-full px-1.5 py-0.5 text-[7.5px] font-medium transition-colors duration-300"
                style={{
                  background: on ? XL1.navy : past ? "rgba(30,42,94,0.1)" : "transparent",
                  color: on ? "white" : XL1.muted,
                }}
              >
                {on && !reduce && (
                  <motion.span
                    key={`p-${scene}`}
                    className="absolute inset-y-0 left-0 bg-white/15"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: s.ms / 1000, ease: "linear" }}
                  />
                )}
                <span className="relative font-mono">{past ? "✓" : i + 1}</span>
                <span className="relative">{s.label}</span>
              </span>
              {i < SCENES.length - 1 && <span className="h-px w-1.5 bg-black/15" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
