"use client";

/**
 * Zero-config demo store.
 * There is no DATABASE_URL and no runtime service: the store is in-memory,
 * mirrored to localStorage so a booking handed over on / is still in the
 * owner inbox on /owner within the same browser. All handed bookings are
 * DEMO; seeded rows are SAMPLE. In production this module is the swap point
 * for a real database (see README).
 */
import { useSyncExternalStore } from "react";
import { SEED_AUDIT, SEED_HANDED } from "@/data/seed";
import { phuketStamp } from "@/lib/format";
import type { AuditRow, HandedBooking } from "@/lib/types";

const STORAGE_KEY = "lr-demo-store-v1";

export type StoreData = {
  handed: HandedBooking[];
  audit: AuditRow[];
  nextRefSeq: number;
};

function seed(): StoreData {
  return { handed: [...SEED_HANDED], audit: [...SEED_AUDIT], nextRefSeq: 1 };
}

let state: StoreData = seed();
const listeners = new Set<() => void>();

function readStorage(): StoreData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    if (!Array.isArray(parsed.handed) || !Array.isArray(parsed.audit)) return null;
    return {
      handed: parsed.handed as HandedBooking[],
      audit: parsed.audit as AuditRow[],
      nextRefSeq: typeof parsed.nextRefSeq === "number" ? parsed.nextRefSeq : 1,
    };
  } catch {
    return null;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode etc: demo still works in memory */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

let hydrated = false;
function ensureHydrated(): void {
  if (!hydrated) {
    hydrated = true;
    const stored = readStorage();
    if (stored) state = stored;
  }
}

function getSnapshot(): StoreData {
  ensureHydrated();
  return state;
}

/** Server snapshot = seeds only, so SSR never depends on browser state. */
function getServerSnapshot(): StoreData {
  return seed();
}

export function useDemoStore(): StoreData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Reserve the next demo booking ref, e.g. LR-DEMO-0001. Called when a card
 *  is created; increments the sequence so refs are unique per browser. */
export function reserveRef(): string {
  ensureHydrated();
  const ref = `LR-DEMO-${String(state.nextRefSeq).padStart(4, "0")}`;
  state = { ...state, nextRefSeq: state.nextRefSeq + 1 };
  emit();
  return ref;
}

/**
 * Hand a finished booking to the manager: appends the booking to the inbox
 * and exactly ONE audit row (mirrors the production promise: every mutation
 * leaves an audit trail).
 */
export function handToManager(booking: HandedBooking["booking"], at: string = phuketStamp()): string {
  ensureHydrated();
  const ref = booking.ref;
  state = {
    handed: [...state.handed, { booking, handedAt: at }],
    audit: [
      ...state.audit,
      {
        ts: at,
        actor: "agent",
        action: "booking handed to manager (DEMO)",
        ref,
      },
    ],
    nextRefSeq: state.nextRefSeq,
  };
  emit();
  return ref;
}

export function resetDemoStore() {
  state = seed();
  hydrated = true;
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  emit();
}
