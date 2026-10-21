import { FLEET, type Lang, getModel } from "@/data/fleet";
import { formatBaht } from "@/lib/format";
import { fill, t, zoneName, type IntentId } from "@/lib/i18n";
import { priceRental } from "@/lib/pricing";
import { checkAvailability } from "@/lib/stock";
import type { BookingData } from "@/lib/types";

/**
 * The "AI agent" of this demo: a deterministic scripted engine (state machine
 * over data/scripts.json). No LLM, no network. It only ever answers from the
 * real data block (data/fleet.ts) or escalates honestly. The production agent
 * would be LLM-backed with the same UX (stated in the owner console FAQ).
 */

const MODEL_ALIASES: ReadonlyArray<readonly [alias: string, modelId: string]> = [
  ["click 160", "click-160"],
  ["click160", "click-160"],
  ["клик 160", "click-160"],
  ["คลิก 160", "click-160"],
  ["click 150", "click-150"],
  ["click150", "click-150"],
  ["клик 150", "click-150"],
  ["คลิก 150", "click-150"],
  ["click 125", "click-125"],
  ["click125", "click-125"],
  ["клик 125", "click-125"],
  ["คลิก 125", "click-125"],
  ["scoopy", "scoopy-110"],
  ["скутер", "scoopy-110"],
  ["скутером", "scoopy-110"],
  ["สกู๊ตเตอร์", "scoopy-110"],
  ["filano", "grand-filano"],
  ["филано", "grand-filano"],
  ["ฟิลาโน่", "grand-filano"],
  ["lead 125", "lead-125"],
  ["lead", "lead-125"],
  ["лид 125", "lead-125"],
  ["ลีด", "lead-125"],
];

/** Scripted default from Section 4 of the brief: Scoopy, two weeks. */
export const DEFAULT_PRICE_MODEL = "scoopy-110";
export const DEFAULT_PRICE_DAYS = 14;

export function parseModel(text: string): string | null {
  const s = text.toLowerCase();
  for (const [alias, modelId] of MODEL_ALIASES) {
    if (s.includes(alias)) return modelId;
  }
  return null;
}

export function parseDurationDays(text: string): number | null {
  const s = text.toLowerCase();
  const dayRe = /(\d{1,2})\s*(?:days?|d\b|день|дней|дня|днів|วัน)/;
  const weekRe = /(\d{1,2})\s*(?:weeks?|недел(?:ь|и|ей)?|тижн(?:і|ень)?|สัปดาห์)/;
  let m = s.match(dayRe);
  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 365) return n;
  }
  m = s.match(weekRe);
  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 52) return n * 7;
  }
  if (/(two weeks|две недели|два тижні|สองสัปดาห์)/.test(s)) return 14;
  if (/(one week|неделю|один тиждень|หนึ่งสัปดาห์)/.test(s)) return 7;
  if (/(month|месяц|місяць|เดือน)/.test(s)) return 30;
  return null;
}

/**
 * Keyword match across all four languages (a visitor may type in any of them
 * regardless of the current UI language). Highest score wins; ties resolve
 * booking > delivery > price. No match -> null (the widget then offers the
 * three intent chips instead of inventing an answer).
 */
export function matchIntent(text: string): IntentId | null {
  const s = text.toLowerCase();
  const langs: Lang[] = ["en", "ru", "ua", "th"];
  const score = (intent: IntentId): number => {
    let n = 0;
    for (const lang of langs) {
      for (const word of t(lang).keywords[intent]) {
        if (word && s.includes(word)) n += 1;
      }
    }
    return n;
  };
  const scores: Record<IntentId, number> = {
    booking: score("booking"),
    delivery: score("delivery"),
    price: score("price"),
  };
  const best = (["booking", "delivery", "price"] as const)
    .map((id) => ({ id, n: scores[id] }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)[0];
  return best ? best.id : null;
}

/** Builds the price answer strictly from real tier prices. */
export function buildPriceAnswer(modelId: string, days: number, lang: Lang): string {
  const model = getModel(modelId);
  if (!model || !Number.isInteger(days) || days < 1) {
    // Never invent: fall back to the scripted Section 4 answer.
    return buildPriceAnswer(DEFAULT_PRICE_MODEL, DEFAULT_PRICE_DAYS, lang);
  }
  const price = priceRental(model, days);
  const tierPrice = model.tiers[price.basis.tierDays];
  const dailyIsExact = tierPrice % price.basis.tierDays === 0;
  const dailyStr =
    (dailyIsExact ? "" : "\u2248") + formatNumberForLang(price.daily, lang);
  return fill(t(lang).priceAnswer, {
    model: model.name,
    days,
    total: formatBaht(price.total, lang),
    daily: dailyStr,
  });
}

function formatNumberForLang(n: number, lang: Lang): string {
  return formatBaht(n, lang).replace(/\s*฿$/, "");
}

export function buildDeliveryAnswer(lang: Lang): string {
  return t(lang).deliveryAnswer;
}

export function buildPriceQuestion(modelId: string, days: number, lang: Lang): string {
  const model = getModel(modelId);
  return fill(t(lang).askPriceQuestion, { model: model?.name ?? "Honda Scoopy 110", days });
}

/* ------------------------------------------------------------------ */
/* Booking state machine                                               */
/* ------------------------------------------------------------------ */

export type BookingStep = "zone" | "dates" | "model" | "done";

export type BookingState = {
  step: BookingStep;
  zoneId?: string;
  start?: string;
  end?: string;
  modelId?: string;
};

export function bookingStart(zoneId?: string): BookingState {
  return zoneId ? { step: "dates", zoneId } : { step: "zone" };
}

export function applyZone(zoneId: string): BookingState {
  return { step: "dates", zoneId };
}

export type DateValidation =
  | { ok: true; state: BookingState }
  | { ok: false; reason: "invalid" };

export function applyDates(
  state: BookingState,
  start: string,
  end: string,
  minStart: string,
): DateValidation {
  if (!state.zoneId) return { ok: false, reason: "invalid" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return { ok: false, reason: "invalid" };
  }
  if (start < minStart || end <= start) return { ok: false, reason: "invalid" };
  return { ok: true, state: { ...state, start, end, step: "model" } };
}

export type ModelResult =
  | { kind: "ok"; state: BookingState }
  | {
      kind: "conflict";
      message: string;
      conflictRefs: string[];
      alternatives: { modelId: string; name: string }[];
    };

/** Checks the deterministic SAMPLE stock; refuses overlaps and names the conflicts. */
export function applyModel(state: BookingState, modelId: string, lang: Lang): ModelResult {
  const { zoneId, start, end } = state;
  const model = getModel(modelId);
  if (!zoneId || !start || !end || !model) return { kind: "ok", state };
  const check = checkAvailability(modelId, zoneId, start, end);
  if (check.available) {
    return { kind: "ok", state: { ...state, modelId, step: "done" } };
  }
  const alternatives = FLEET.filter((m) => {
    if (m.id === modelId) return false;
    return checkAvailability(m.id, zoneId, start, end).available;
  }).map((m) => ({ modelId: m.id, name: m.name }));

  const script = t(lang).booking;
  const message =
    alternatives.length > 0
      ? fill(script.conflict, {
          model: model.name,
          zone: zoneName(lang, zoneId),
          start,
          end,
          refs: check.conflicts.join(", "),
          alts: alternatives.map((a) => a.name).join(", "),
        })
      : fill(script.noAlts, { zone: zoneName(lang, zoneId), start, end });
  return { kind: "conflict", message, conflictRefs: [...check.conflicts], alternatives };
}

export function buildBooking(state: BookingState, ref: string, lang: Lang): BookingData | null {
  const { zoneId, start, end, modelId } = state;
  const model = modelId ? getModel(modelId) : undefined;
  if (!zoneId || !start || !end || !model) return null;
  const days = Math.round(
    (Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 86_400_000,
  );
  const price = priceRental(model, days);
  return {
    ref,
    lang,
    zoneId,
    modelId: model.id,
    start,
    end,
    days,
    total: price.total,
    formula: price.formula,
  };
}
