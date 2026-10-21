import { TIER_DAYS, type BikeModel, type TierDays } from "@/data/fleet";

/**
 * Pricing rules (from the build brief, Section 4):
 * - Durations that exactly match a tier (7/14/21/30 d) cost the tier price.
 * - Any other duration is pro-rated at the daily rate of the NEAREST tier:
 *     total = days x (nearestTierPrice / nearestTierDays), rounded to whole baht.
 * - Ties between two tiers resolve to the smaller tier (deterministic).
 * Every result carries the formula string so the UI can show its work.
 */

export type PriceBasis =
  | { kind: "exact-tier"; tierDays: TierDays }
  | { kind: "nearest-tier"; tierDays: TierDays };

export type PriceResult = {
  days: number;
  total: number;
  /** Display daily rate (tier price / tier days), rounded for display. */
  daily: number;
  basis: PriceBasis;
  /** Human-verifiable formula, mono type in the UI. */
  formula: string;
};

export function nearestTier(model: BikeModel, days: number): TierDays {
  let best: TierDays = TIER_DAYS[0] as TierDays;
  let bestDist = Infinity;
  for (const t of TIER_DAYS) {
    const dist = Math.abs(t - days);
    if (dist < bestDist) {
      best = t;
      bestDist = dist;
    }
  }
  return best;
}

export function priceRental(model: BikeModel, days: number): PriceResult {
  if (!Number.isInteger(days) || days < 1) {
    throw new Error(`priceRental: days must be a positive integer, got ${days}`);
  }
  const tierDays = (TIER_DAYS as readonly number[]).includes(days)
    ? (days as TierDays)
    : nearestTier(model, days);
  const tierPrice = model.tiers[tierDays];
  const rawDaily = tierPrice / tierDays;
  const exact = tierDays === days;
  const total = exact ? tierPrice : Math.round(days * rawDaily);
  const formula = exact
    ? `${days} d = tier price = ${tierPrice} \u0e3f (their price list)`
    : `${days} d \u00d7 (${tierPrice} \u0e3f \u00f7 ${tierDays} d) = ${total} \u0e3f (nearest tier: ${tierDays} d)`;
  return {
    days,
    total,
    daily: Math.round(rawDaily),
    basis: { kind: exact ? "exact-tier" : "nearest-tier", tierDays },
    formula,
  };
}
