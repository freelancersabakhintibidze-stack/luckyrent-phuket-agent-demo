import { addDays, phuketToday } from "@/lib/format";

/**
 * Deterministic seeded availability. Everything in this file is SAMPLE data
 * ("simulated for demonstration") and is labeled as such in the UI.
 * Real availability would come from Luckyrent's actual fleet system.
 *
 * Model: each model has a small number of units per zone (SAMPLE capacity).
 * Seeded sample bookings occupy units over date windows. A requested rental
 * [start, end) overlaps a sample booking when start < bookingEnd and
 * bookingStart < end. When overlapping bookings >= capacity, the agent refuses
 * and names the conflicting sample booking refs.
 *
 * The windows are anchored to "today on the Phuket clock" so the conflict
 * demonstration keeps working whenever the demo is viewed, while remaining
 * deterministic within a day.
 */

export type SampleBooking = {
  ref: string;
  modelId: string;
  zoneId: string;
  /** Inclusive start, exclusive end (YYYY-MM-DD, Phuket calendar). */
  start: string;
  end: string;
};

/** SAMPLE unit counts per model (same in every zone). */
export const SAMPLE_CAPACITY: Record<string, number> = {
  "scoopy-110": 3,
  "click-125": 2,
  "click-150": 2,
  "click-160": 2,
  "grand-filano": 2,
  "lead-125": 2,
};

const T = phuketToday();
const d = (n: number) => addDays(T, n);

/** SAMPLE bookings already on the books (seeded, static per day, deterministic). */
export const SAMPLE_BOOKINGS: readonly SampleBooking[] = [
  { ref: "LR-SAMPLE-0101", modelId: "click-160", zoneId: "bang-tao", start: d(4), end: d(9) },
  { ref: "LR-SAMPLE-0102", modelId: "click-160", zoneId: "bang-tao", start: d(5), end: d(13) },
  { ref: "LR-SAMPLE-0103", modelId: "grand-filano", zoneId: "kamala", start: d(12), end: d(26) },
  { ref: "LR-SAMPLE-0104", modelId: "scoopy-110", zoneId: "rawai", start: d(2), end: d(7) },
  { ref: "LR-SAMPLE-0105", modelId: "scoopy-110", zoneId: "rawai", start: d(3), end: d(16) },
  { ref: "LR-SAMPLE-0106", modelId: "lead-125", zoneId: "bang-tao", start: d(61), end: d(77) },
  { ref: "LR-SAMPLE-0107", modelId: "click-125", zoneId: "phuket", start: d(6), end: d(11) },
];

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export type AvailabilityResult =
  | { available: true; freeUnits: number; conflicts: readonly string[] }
  | { available: false; freeUnits: 0; conflicts: readonly string[] };

export function checkAvailability(
  modelId: string,
  zoneId: string,
  start: string,
  end: string,
): AvailabilityResult {
  const capacity = SAMPLE_CAPACITY[modelId] ?? 2;
  const conflicts = SAMPLE_BOOKINGS.filter(
    (b) => b.modelId === modelId && b.zoneId === zoneId && overlaps(start, end, b.start, b.end),
  ).map((b) => b.ref);
  const freeUnits = capacity - conflicts.length;
  if (freeUnits <= 0) {
    return { available: false, freeUnits: 0, conflicts };
  }
  return { available: true, freeUnits, conflicts };
}
