/**
 * SINGLE SOURCE OF TRUTH for all real business data in this demo.
 * Mirrors Section 3 of the build brief. Source: public luckyrent-phuket.com,
 * fetched 2026-10-20. Edit fleet/prices/zones HERE and nowhere else.
 *
 * Truth contract: nothing in this file may be invented. Anything not present
 * here (or in data/seed.ts) must be labeled SAMPLE in the UI.
 */

export const FETCH_DATE = "2026-10-20";
export const SITE = "https://luckyrent-phuket.com";

export const LANGS = ["en", "ru", "ua", "th"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<Lang, { label: string; name: string; htmlLang: string }> = {
  en: { label: "EN", name: "English", htmlLang: "en" },
  ru: { label: "RU", name: "Русский", htmlLang: "ru" },
  ua: { label: "UA", name: "Українська", htmlLang: "uk" },
  th: { label: "TH", name: "ไทย", htmlLang: "th" },
};

export const BRAND = {
  name: "Lucky Rent / Luckyrent Phuket",
  business: "Motorbike & scooter rental, Phuket, Thailand",
  site: SITE,
} as const;

/** Homepage headline price. Real. */
export const HEADLINE_PRICE = {
  text: "from 130 \u0e3f/day (about $4)",
  bahtPerDay: 130,
  usdApprox: 4,
  source: "luckyrent-phuket.com homepage title",
} as const;

/** Rating line displayed on their homepage (Elfsight Google reviews widget). Real. */
export const RATING = {
  score: 4.7,
  reviews: 743,
  source: "luckyrent-phuket.com (Google reviews widget)",
} as const;

/** Their published staff hours. Real (source: their Telegram bio). */
export const STAFF_HOURS = {
  bookings: { start: "09:00", end: "21:00" },
  support: { start: "10:00", end: "20:00" },
  source: "Luckyrent Telegram bio",
} as const;

/** Homepage value propositions. Real, verbatim meaning preserved. */
export const VALUE_PROPS = [
  { id: "delivery", en: "Delivery all over Phuket, to your place" },
  { id: "gear", en: "2 helmets + 2 raincoats, free" },
  { id: "holder", en: "Free phone holder on every bike" },
  { id: "insurance", en: "Insurance for rider and passenger" },
] as const;

/** Delivery promise. Real (source: their Bang Tao page). */
export const DELIVERY_PROMISE = {
  minutes: 60,
  source: "luckyrent-phuket.com/location/bang-tao-beach/",
} as const;

export type TierDays = 7 | 14 | 21 | 30;
export const TIER_DAYS: readonly TierDays[] = [7, 14, 21, 30];

export type BikeModel = {
  id: string;
  name: string;
  loadKg: number;
  maxSpeedKmh: number;
  comfortableSpeedKmh: number;
  /** Exact tier prices in THB, from their site. Real. */
  tiers: Record<TierDays, number>;
  sourceUrl: string;
};

/** The six real models with real tier prices and specs. */
export const FLEET: readonly BikeModel[] = [
  {
    id: "scoopy-110",
    name: "Honda Scoopy 110",
    loadKg: 130,
    maxSpeedKmh: 70,
    comfortableSpeedKmh: 50,
    tiers: { 7: 1610, 14: 2520, 21: 3360, 30: 4000 },
    sourceUrl: "https://luckyrent-phuket.com/product/honda-scoopy-110/",
  },
  {
    id: "click-125",
    name: "Honda Click 125",
    loadKg: 140,
    maxSpeedKmh: 90,
    comfortableSpeedKmh: 60,
    tiers: { 7: 1600, 14: 2500, 21: 3300, 30: 4000 },
    sourceUrl: "https://luckyrent-phuket.com/product/honda-click-125/",
  },
  {
    id: "click-150",
    name: "Honda Click 150",
    loadKg: 150,
    maxSpeedKmh: 100,
    comfortableSpeedKmh: 70,
    tiers: { 7: 1600, 14: 2500, 21: 3300, 30: 4000 },
    sourceUrl: SITE,
  },
  {
    id: "click-160",
    name: "Honda Click 160",
    loadKg: 150,
    maxSpeedKmh: 110,
    comfortableSpeedKmh: 70,
    tiers: { 7: 1800, 14: 2700, 21: 3900, 30: 4500 },
    sourceUrl: "https://luckyrent-phuket.com/product/honda-click-160/",
  },
  {
    id: "grand-filano",
    name: "Yamaha Grand Filano",
    loadKg: 150,
    maxSpeedKmh: 90,
    comfortableSpeedKmh: 60,
    tiers: { 7: 1890, 14: 2940, 21: 3990, 30: 4500 },
    sourceUrl: SITE,
  },
  {
    id: "lead-125",
    name: "Honda Lead 125",
    loadKg: 150,
    maxSpeedKmh: 90,
    comfortableSpeedKmh: 60,
    tiers: { 7: 1610, 14: 2520, 21: 3360, 30: 4000 },
    sourceUrl: SITE,
  },
];

export type Zone = {
  id: string;
  /** Display name; localized names live in data/scripts.json. */
  name: string;
  note: string;
  sourceUrl: string;
};

/** Real delivery zones: their three location pages + island-wide promise. */
export const ZONES: readonly Zone[] = [
  {
    id: "bang-tao",
    name: "Bang Tao",
    note: "Bike delivered in 60 minutes (their Bang Tao page)",
    sourceUrl: "https://luckyrent-phuket.com/location/bang-tao-beach/",
  },
  {
    id: "kamala",
    name: "Kamala",
    note: "Location page on their site; island-wide delivery promise applies",
    sourceUrl: "https://luckyrent-phuket.com/location/kamala-rent-bike/",
  },
  {
    id: "rawai",
    name: "Rawai",
    note: "Location page on their site; island-wide delivery promise applies",
    sourceUrl: "https://luckyrent-phuket.com/location/rawai-motorbike-rental/",
  },
  {
    id: "phuket",
    name: "Anywhere in Phuket",
    note: "Homepage: delivery all over Phuket",
    sourceUrl: SITE,
  },
];

/** The only two review quotes allowed, verbatim, from the public widget on their site. */
export const REVIEW_QUOTES = [
  {
    quote: "Very understanding fast, fast anwer, I love it",
    author: "Jordan Guerin",
    label: "public review, their site",
  },
  {
    quote: "Well maintained bikes and good rates. This is my second time using their services.",
    author: "A. Zinbi",
    label: "public review, their site",
  },
] as const;

export function getModel(id: string): BikeModel | undefined {
  return FLEET.find((m) => m.id === id);
}

export function getZone(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}
