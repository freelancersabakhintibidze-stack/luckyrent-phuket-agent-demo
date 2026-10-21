import { buildPriceAnswer } from "@/lib/agent";
import type { AuditRow, HandedBooking, InboxItem } from "@/lib/types";

/**
 * SEEDED SAMPLE DATA for the owner console (Surface B).
 * Every value here is invented for the demonstration and is labeled SAMPLE
 * in the UI ("simulated for demonstration"). None of it is real Luckyrent
 * data. Real data lives only in data/fleet.ts.
 */

/** Live handovers start empty; the seeded finished bookings live in SEED_INBOX. */
export const SEED_HANDED: HandedBooking[] = [];

export const SEED_INBOX: InboxItem[] = [
  {
    id: "seed-en-1",
    lang: "en",
    sample: true,
    customer: "How much is a Scoopy for two weeks?",
    agentReply: buildPriceAnswer("scoopy-110", 14, "en"),
    status: "auto-answered",
  },
  {
    id: "seed-en-2",
    lang: "en",
    sample: true,
    customer: "Hi, I want to book a Honda Click 125 in Kamala, 5 to 19 November.",
    agentReply:
      "Finished booking card below: zone, model, dates, total from the real tier price list, delivery window, and one open question (deposit terms, manager confirms). Handed to manager.",
    status: "finished-booking",
    booking: {
      ref: "LR-SAMPLE-0201",
      lang: "en",
      zoneId: "kamala",
      modelId: "click-125",
      start: "2026-11-05",
      end: "2026-11-19",
      days: 14,
      total: 2500,
      formula: "14 d = tier price = 2,500 \u0e3f (their price list)",
      sample: true,
    },
    handedAt: "2026-10-20 04:06:40",
  },
  {
    id: "seed-ru-1",
    lang: "ru",
    sample: true,
    customer: "Сколько скутер на две недели?",
    agentReply: buildPriceAnswer("scoopy-110", 14, "ru"),
    status: "auto-answered",
  },
  {
    id: "seed-ru-2",
    lang: "ru",
    sample: true,
    customer: "Какой депозит? И нужно ли оставлять паспорт?",
    agentReply:
      "Сумма депозита не опубликована на их сайте, про паспорт в открытых данных ничего нет; угадывать не буду. Вопрос передан менеджеру (эскалация). (ДЕМО)",
    status: "needs-human",
  },
  {
    id: "seed-ua-1",
    lang: "ua",
    sample: true,
    customer: "Скільки коштує Honda Click 160 на 7 днів?",
    agentReply: buildPriceAnswer("click-160", 7, "ua"),
    status: "auto-answered",
  },
  {
    id: "seed-th-1",
    lang: "th",
    sample: true,
    customer: "อยากจอง Honda Scoopy 110 ที่บางเทา 1-15 ธันวาคม",
    agentReply:
      "บัตรจองที่สมบูรณ์อยู่ด้านล่าง: โซน รุ่น วันที่ ยอดรวมตามตารางราคาจริง ช่วงเวลาจัดส่ง และคำถามค้างหนึ่งข้อ (เงื่อนไขเงินมัดจำ ผู้จัดการยืนยัน) ส่งต่อให้ผู้จัดการแล้ว",
    status: "finished-booking",
    booking: {
      ref: "LR-SAMPLE-0202",
      lang: "th",
      zoneId: "bang-tao",
      modelId: "scoopy-110",
      start: "2026-12-01",
      end: "2026-12-15",
      days: 14,
      total: 2520,
      formula: "14 d = tier price = 2,520 \u0e3f (their price list)",
      sample: true,
    },
    handedAt: "2026-10-20 05:33:02",
  },
];

/** Seeded audit rows (SAMPLE). Rows appended during a visit are live DEMO rows. */
export const SEED_AUDIT: AuditRow[] = [
  { ts: "2026-10-20 01:12:04", actor: "agent", action: "auto-answered price question (EN)", ref: "" },
  { ts: "2026-10-20 02:47:31", actor: "agent", action: "auto-answered price question (RU)", ref: "" },
  { ts: "2026-10-20 03:20:55", actor: "agent", action: "flagged deposit question for human (RU)", ref: "" },
  { ts: "2026-10-20 04:05:12", actor: "agent", action: "booking card finished (EN)", ref: "LR-SAMPLE-0201" },
  { ts: "2026-10-20 04:06:40", actor: "agent", action: "booking handed to manager (EN)", ref: "LR-SAMPLE-0201" },
  { ts: "2026-10-20 05:31:18", actor: "agent", action: "booking card finished (TH)", ref: "LR-SAMPLE-0202" },
  { ts: "2026-10-20 05:33:02", actor: "agent", action: "booking handed to manager (TH)", ref: "LR-SAMPLE-0202" },
  { ts: "2026-10-20 09:02:10", actor: "human", action: "manager confirmed deposit terms, replied to customer", ref: "LR-SAMPLE-0201" },
];

/** KPI seeds (SAMPLE) shown in the owner console, with formulas. */
export const KPI_SEED = {
  messagesPerWeek: 84,
  outsideStaffSharePct: 38,
  answeredByAgent: 62,
  escalatedToHuman: 22,
  finishedHandoversPerWeek: 9,
  avgHandleMinutes: 4,
  staffHoursReturnedPerWeek: 4.1,
} as const;

export const CALC_DEFAULTS = {
  /** Derived from REAL data: Scoopy 7-day tier 1,610 / 7 = 230. Editable, SAMPLE in use. */
  dailyRateBaht: 230,
  nightMessagesPerDay: 6,
  closeRatePct: 25,
  avgRentalDays: 7,
} as const;

export const INBOX_STATUS_LABELS: Record<InboxItem["status"], string> = {
  "auto-answered": "auto-answered",
  "needs-human": "needs human",
  "finished-booking": "finished booking",
};
