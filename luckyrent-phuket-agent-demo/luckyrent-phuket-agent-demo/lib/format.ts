import type { Lang } from "@/data/fleet";

/** 1 234 567 formatting per language, deterministic (no locale surprises). */
export function formatNumber(n: number, lang: Lang): string {
  const rounded = Math.round(n);
  const s = String(Math.abs(rounded));
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, lang === "ru" || lang === "ua" ? "\u2009" : ",");
  return (rounded < 0 ? "-" : "") + grouped;
}

export function formatBaht(n: number, lang: Lang): string {
  return `${formatNumber(n, lang)} \u0e3f`;
}

/** Dates are handled as plain YYYY-MM-DD strings (Phuket calendar day, no time zone drift). */
export function isValidDateStr(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Whole days from start (inclusive) to end (exclusive). */
export function diffDays(start: string, end: string): number {
  const a = Date.parse(start + "T00:00:00Z");
  const b = Date.parse(end + "T00:00:00Z");
  return Math.round((b - a) / 86_400_000);
}

/** Phuket is UTC+7 with no DST: computed deterministically, no ICU needed. */
export function phuketToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 7 * 3_600_000).toISOString().slice(0, 10);
}

export function phuketTomorrow(now: Date = new Date()): string {
  return addDays(phuketToday(now), 1);
}

/** "YYYY-MM-DD HH:MM:SS" on the Phuket clock (UTC+7), for audit stamps. */
export function phuketStamp(now: Date = new Date()): string {
  return new Date(now.getTime() + 7 * 3_600_000).toISOString().slice(0, 19).replace("T", " ");
}
