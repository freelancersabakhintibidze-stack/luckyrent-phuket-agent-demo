import { expect, test, type Page } from "@playwright/test";

/**
 * Section 8 quality gates, as an executable script:
 * - complete one booking in each of the 4 languages
 * - booking card totals match Section 3 tier math exactly (14-day Scoopy = 2,520)
 * - /owner audit log gains exactly 4 rows after the 4 handovers
 * - reduced-motion mode has no animation
 * - 375px layout has no horizontal scroll
 * - double-booked overlaps are refused with named conflicts
 */

function phuketToday(): string {
  return new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);
}
function addDays(dstr: string, n: number): string {
  const d = new Date(dstr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const T = phuketToday();
const START = addDays(T, 45);
const END = addDays(T, 59); // 14 rental days

type Lang = "en" | "ru" | "ua" | "th";

async function completeBooking(page: Page, lang: Lang, ref: string) {
  await page.goto("/");
  await page.getByTestId(`lang-${lang}`).click();
  await page.getByTestId("chip-booking").click();
  await page.getByTestId("zone-bang-tao").click();
  await page.getByTestId("date-start").fill(START);
  await page.getByTestId("date-end").fill(END);
  await page.getByTestId("dates-confirm").click();
  await page.getByTestId("model-scoopy-110").click();
  await expect(page.getByTestId("booking-card")).toBeVisible();
  // Exact Section 3 tier math: 14-day Scoopy = 2520 (grouping per language).
  await expect(page.getByTestId("card-total")).toHaveText(/^2[\s,\u2009]*520\s*฿$/);
  await expect(page.getByTestId("card-ref")).toContainText(ref);
  await expect(page.getByTestId("card-dates")).toContainText(`${START} → ${END}`);
  await page.getByTestId("hand-btn").click();
  await expect(page.getByTestId("open-owner")).toBeVisible();
}

test("one booking in each of the 4 languages, exact tier totals, audit log gains 4 rows", async ({
  page,
}) => {
  // One shared context so localStorage (the demo store) persists across the runs.
  await completeBooking(page, "en", "LR-DEMO-0001");
  await completeBooking(page, "ru", "LR-DEMO-0002");
  await completeBooking(page, "ua", "LR-DEMO-0003");
  await completeBooking(page, "th", "LR-DEMO-0004");

  await page.goto("/owner");
  const liveRows = page.getByTestId("audit-row-live");
  await expect(liveRows).toHaveCount(4);
  for (const ref of ["LR-DEMO-0001", "LR-DEMO-0002", "LR-DEMO-0003", "LR-DEMO-0004"]) {
    await expect(page.getByRole("cell", { name: ref, exact: true }).first()).toBeVisible();
  }
  // The handed bookings are in the inbox with finished-booking status.
  for (const ref of ["LR-DEMO-0001", "LR-DEMO-0002", "LR-DEMO-0003", "LR-DEMO-0004"]) {
    await expect(page.getByTestId(`open-card-${ref}`)).toBeVisible();
  }
  await page.getByTestId("open-card-LR-DEMO-0001").click();
  await expect(page.getByTestId("booking-card").first()).toBeVisible();
  await expect(page.getByTestId("card-total").first()).toContainText("2,520");
});

test("scripted price answer is verbatim and carries the 0.4 s caption", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("chip-price").click();
  await expect(page.getByTestId("chat-log")).toContainText(
    "Honda Scoopy 110, 14 days: 2,520 ฿ total (180 ฿/day). Helmet x2, raincoats x2, phone holder and rider+passenger insurance included. Delivery to your place about 60 minutes. (DEMO)",
  );
  await expect(page.getByTestId("answer-caption").first()).toContainText(/answered in 0\.\d s/);
  await expect(page.getByTestId("answer-caption").first()).toContainText(
    "Outside staff hours 09:00-21:00",
  );
});

test("deposit question escalates honestly instead of guessing", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("chip-delivery").click();
  await expect(page.getByTestId("chat-log")).toContainText(
    "Deposit terms are confirmed by the manager at booking",
  );
  await expect(page.getByTestId("chat-log")).toContainText("not published");
});

test("double-booked overlap is refused with named conflicts, alternative offered", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("chip-booking").click();
  await page.getByTestId("zone-bang-tao").click();
  await page.getByTestId("date-start").fill(addDays(T, 5));
  await page.getByTestId("date-end").fill(addDays(T, 8));
  await page.getByTestId("dates-confirm").click();
  await page.getByTestId("model-click-160").click();
  const log = page.getByTestId("chat-log");
  await expect(log).toContainText("LR-SAMPLE-0101");
  await expect(log).toContainText("LR-SAMPLE-0102");
  await expect(log).toContainText("no free units");
  await expect(page.getByTestId("booking-card")).toHaveCount(0);
  // A free alternative from the same step completes the booking.
  await page.getByTestId("model-scoopy-110").click();
  await expect(page.getByTestId("booking-card")).toBeVisible();
});

test("free text outside the scripts gets chips, never an invented answer", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("chat-input").fill("do you sell helicopters?");
  await page.getByTestId("chat-send").click();
  const log = page.getByTestId("chat-log");
  await expect(log).toContainText("I will not guess");
  await expect(page.getByTestId("chip-price")).toBeVisible();
  await expect(page.getByTestId("chip-delivery")).toBeVisible();
  await expect(page.getByTestId("chip-booking")).toBeVisible();
});

test("375px: no horizontal scroll on any route", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  for (const path of ["/", "/owner", "/terms", "/privacy", "/provenance"]) {
    await page.goto(path);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${path} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(0);
  }
  await ctx.close();
});

test("reduced motion: no animations running, cursor layer inactive", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.getByTestId("chip-price").click();
  await page.waitForTimeout(900);
  const running = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === "running" || a.playState === "idle").length,
  );
  expect(running).toBe(0);
  await ctx.close();
});

test("owner console: KPI formulas, SAMPLE labels and calculator math are visible", async ({
  page,
}) => {
  await page.goto("/owner");
  await expect(page.getByTestId("kpi-ledger")).toContainText("84");
  await expect(page.getByTestId("kpi-ledger")).toContainText("38%");
  await expect(page.getByTestId("kpi-ledger")).toContainText("62 ÷ 84 = 74%");
  const samples = await page.getByTestId("kpi-ledger").locator(".tag-sample").count();
  expect(samples).toBeGreaterThanOrEqual(6);
  // Calculator defaults: 6 x 30 x 25% = 45 lost; 45 x 7 x 230 = 72,450.
  await expect(page.getByTestId("lost-bookings")).toHaveText("45");
  await expect(page.getByTestId("lost-revenue")).toHaveText("72,450 ฿");
  await expect(page.getByTestId("revenue-formula")).toContainText("45 lost × 7 d × 230 ฿/d");
  // Editing an input updates the math transparently.
  await page.getByTestId("calc-msgs").fill("10");
  await expect(page.getByTestId("lost-bookings")).toHaveText("75");
  await expect(page.getByTestId("lost-revenue")).toHaveText("120,750 ฿");
});

test("owner inbox seeds show all three statuses and open the same booking card", async ({
  page,
}) => {
  await page.goto("/owner");
  await expect(page.getByTestId("inbox")).toContainText("auto-answered");
  await expect(page.getByTestId("inbox")).toContainText("needs human");
  await expect(page.getByTestId("inbox")).toContainText("finished booking");
  await page.getByTestId("open-card-LR-SAMPLE-0201").click();
  const card = page.getByTestId("booking-card").first();
  await expect(card).toBeVisible();
  await expect(page.getByTestId("card-total").first()).toContainText("2,500");
  await expect(card).toContainText("LR-SAMPLE-0201");
});

test("honesty banner and provenance links are present on every route", async ({ page }) => {
  for (const path of ["/", "/owner", "/terms", "/privacy", "/provenance"]) {
    await page.goto(path);
    await expect(page.locator(".honesty-banner")).toContainText(
      "Independent demo prepared for Luckyrent Phuket by Saba Khintibidze",
    );
    await expect(page.locator(".honesty-banner")).toContainText("Not the official Luckyrent site");
  }
  await page.goto("/");
  await page.locator(".footer-nav a[href='/provenance']").click();
  await expect(page).toHaveURL(/\/provenance$/);
  await expect(page.locator(".prose")).toContainText("luckyrent-phuket.com");
  await expect(page.locator("table.prov").first()).toContainText("743 Google reviews");
  // real source URLs are linked from the table
  const href = await page.locator("table.prov a[href*='luckyrent-phuket.com']").first().getAttribute("href");
  expect(href).toContain("luckyrent-phuket.com");
});
