import raw from "@/data/scripts.json";
import type { Lang } from "@/data/fleet";

/** Typed view over data/scripts.json (the scripted conversation engine). */

export type IntentId = "price" | "delivery" | "booking";

export type CardLabels = {
  finished: string;
  ref: string;
  zone: string;
  model: string;
  dates: string;
  days: string;
  total: string;
  included: string;
  delivery: string;
  openQuestions: string;
  hand: string;
  handed: string;
  openInbox: string;
  demoReason: string;
  formulaNote: string;
  includedValue: string;
  deliveryValue: string;
  depositQuestion: string;
};

export type BookingScript = {
  intro: string;
  askZone: string;
  askDates: string;
  askModel: string;
  datesInvalid: string;
  dateStart: string;
  dateEnd: string;
  dateHint: string;
  confirmDates: string;
  conflict: string;
  noAlts: string;
  handedOk: string;
  inboxSummary: string;
  inboxReply: string;
  daysShort: string;
};

export type LangScript = {
  greeting: string;
  unmatched: string;
  chips: Record<IntentId, string>;
  priceAnswer: string;
  deliveryAnswer: string;
  askPriceQuestion: string;
  typing: string;
  caption: string;
  composerPlaceholder: string;
  send: string;
  restart: string;
  keywords: Record<IntentId, string[]>;
  booking: BookingScript;
  zones: Record<string, string>;
  card: CardLabels;
};

export const SCRIPTS = raw as Record<Lang, LangScript>;

export function t(lang: Lang): LangScript {
  return SCRIPTS[lang];
}

/** Deterministic {placeholder} substitution. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in vars ? String(vars[key]) : m,
  );
}

export function zoneName(lang: Lang, zoneId: string): string {
  return t(lang).zones[zoneId] ?? zoneId;
}
