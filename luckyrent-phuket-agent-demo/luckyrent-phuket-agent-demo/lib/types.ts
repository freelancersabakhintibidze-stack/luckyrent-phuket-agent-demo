import type { Lang } from "@/data/fleet";

/** A finished booking card's data. Refs LR-DEMO-* are live demo bookings;
 *  LR-SAMPLE-* refs are seeded sample data. */
export type BookingData = {
  ref: string;
  lang: Lang;
  zoneId: string;
  modelId: string;
  /** Inclusive start (YYYY-MM-DD, Phuket calendar). */
  start: string;
  /** Exclusive end = return day (YYYY-MM-DD). */
  end: string;
  days: number;
  total: number;
  /** The formula behind `total`, shown in the UI (mono). */
  formula: string;
  /** true for seeded sample bookings. */
  sample?: boolean;
};

export type HandedBooking = { booking: BookingData; handedAt: string };

export type AuditRow = {
  /** Display stamp, Phuket time, "YYYY-MM-DD HH:MM:SS". */
  ts: string;
  actor: "agent" | "human";
  action: string;
  /** Booking ref when the action relates to one. */
  ref: string;
};

export type InboxStatus = "auto-answered" | "needs-human" | "finished-booking";

export type InboxItem = {
  id: string;
  lang: Lang;
  /** true = seeded SAMPLE conversation; false = live DEMO handover. */
  sample: boolean;
  customer: string;
  agentReply: string;
  status: InboxStatus;
  booking?: BookingData;
  handedAt?: string;
};
