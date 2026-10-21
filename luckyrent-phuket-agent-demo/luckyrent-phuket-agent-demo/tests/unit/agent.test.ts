import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyDates,
  applyModel,
  applyZone,
  bookingStart,
  buildBooking,
  buildPriceAnswer,
  matchIntent,
  parseDurationDays,
  parseModel,
} from "@/lib/agent";
import { addDays, phuketToday, phuketTomorrow } from "@/lib/format";
import { checkAvailability } from "@/lib/stock";

/** Section 4 verbatim answers (thin spaces normalized for RU/UA grouping). */
const norm = (s: string) => s.replace(/[\u2009\u00a0]/g, " ");

describe("scripted price answers match Section 4 verbatim", () => {
  it("EN: Scoopy, two weeks", () => {
    assert.equal(
      buildPriceAnswer("scoopy-110", 14, "en"),
      "Honda Scoopy 110, 14 days: 2,520 \u0e3f total (180 \u0e3f/day). Helmet x2, raincoats x2, phone holder and rider+passenger insurance included. Delivery to your place about 60 minutes. (DEMO)",
    );
  });
  it("RU: Scoopy, two weeks", () => {
    assert.equal(
      norm(buildPriceAnswer("scoopy-110", 14, "ru")),
      "Honda Scoopy 110, 14 дней: 2 520 \u0e3f (180 \u0e3f/день). Два шлема, два дождевика, держатель телефона и страховка водителя+пассажира включены. Доставка около 60 минут. (ДЕМО)",
    );
  });
  it("UA: Scoopy, two weeks", () => {
    assert.equal(
      norm(buildPriceAnswer("scoopy-110", 14, "ua")),
      "Honda Scoopy 110, 14 днів: 2 520 \u0e3f (180 \u0e3f/день). Два шоломи, два дощовики, тримач телефона та страховка водія й пасажира включені. Доставка близько 60 хвилин. (ДЕМО)",
    );
  });
  it("TH: Scoopy, two weeks", () => {
    assert.equal(
      buildPriceAnswer("scoopy-110", 14, "th"),
      "Honda Scoopy 110 เช่า 14 วัน: 2,520 \u0e3f (180 \u0e3f/วัน) รวมหมวกกันน็อก 2 ใบ เสื้อกันฝน 2 ตัว ที่วางโทรศัพท์ และประกันภัยผู้ขับขี่+ผู้โดยสาร จัดส่งประมาณ 60 นาที (เดโม)",
    );
  });
  it("never invents: unknown model falls back to the scripted answer", () => {
    assert.equal(
      buildPriceAnswer("ducati-v4", 14, "en"),
      buildPriceAnswer("scoopy-110", 14, "en"),
    );
  });
});

describe("intent matching (4 languages, keyword based)", () => {
  it("EN chips", () => {
    assert.equal(matchIntent("How much is a Scoopy for two weeks?"), "price");
    assert.equal(matchIntent("Is delivery to Bang Tao really free? And what is the deposit?"), "delivery");
    assert.equal(matchIntent("I want to book a bike"), "booking");
  });
  it("RU chips", () => {
    assert.equal(matchIntent("Сколько скутер на две недели?"), "price");
    assert.equal(matchIntent("Доставка в Банг Тао правда бесплатная? И какой депозит?"), "delivery");
    assert.equal(matchIntent("Хочу забронировать байк"), "booking");
  });
  it("UA chips", () => {
    assert.equal(matchIntent("Скільки скутер на два тижні?"), "price");
    assert.equal(matchIntent("Доставка в Банг Тао справді безкоштовна? І який депозит?"), "delivery");
    assert.equal(matchIntent("Хочу забронювати байк"), "booking");
  });
  it("TH chips", () => {
    assert.equal(matchIntent("ราคาสกู๊ตเตอร์สองสัปดาห์เท่าไหร่คะ?"), "price");
    assert.equal(matchIntent("ส่งที่บางเทาฟรีจริงไหมคะ แล้วเงินมัดจำเท่าไหร่?"), "delivery");
    assert.equal(matchIntent("อยากจองรถค่ะ"), "booking");
  });
  it("unmatched text returns null (agent then offers chips, never guesses)", () => {
    assert.equal(matchIntent("asdf qwr zzz"), null);
  });
  it("parses model and duration from free text", () => {
    assert.equal(parseModel("what is the price of a Honda Click 160?"), "click-160");
    assert.equal(parseModel("Сколько стоит Yamaha Grand Filano"), "grand-filano");
    assert.equal(parseDurationDays("for 8 days"), 8);
    assert.equal(parseDurationDays("на 21 день"), 21);
    assert.equal(parseDurationDays("สองสัปดาห์"), 14);
    assert.equal(parseDurationDays("two weeks"), 14);
    assert.equal(parseDurationDays("3 สัปดาห์"), 21);
  });
});

describe("booking flow + SAMPLE stock conflicts", () => {
  const T = phuketToday();
  const d = (n: number) => addDays(T, n);

  it("happy path: Bang Tao, Scoopy, 14 days -> total 2,520 with formula", () => {
    let st = bookingStart();
    st = applyZone("bang-tao");
    const res = applyDates(st, d(45), d(59), phuketTomorrow());
    assert.ok(res.ok);
    const m = applyModel(res.state, "scoopy-110", "en");
    assert.equal(m.kind, "ok");
    if (m.kind !== "ok") return;
    const booking = buildBooking(m.state, "LR-DEMO-0001", "en");
    assert.ok(booking);
    assert.equal(booking.days, 14);
    assert.equal(booking.total, 2520);
    assert.match(booking.formula, /tier price = 2520|tier price = 2,520/);
  });

  it("refuses double-booked overlap and names the conflicting refs", () => {
    const st = applyZone("bang-tao");
    const res = applyDates(st, d(5), d(8), phuketTomorrow());
    assert.ok(res.ok);
    const m = applyModel(res.state, "click-160", "en");
    assert.equal(m.kind, "conflict");
    if (m.kind !== "conflict") return;
    assert.deepEqual(m.conflictRefs.sort(), ["LR-SAMPLE-0101", "LR-SAMPLE-0102"]);
    assert.match(m.message, /LR-SAMPLE-0101/);
    assert.match(m.message, /LR-SAMPLE-0102/);
    assert.ok(m.alternatives.length > 0);
    assert.ok(!m.alternatives.some((a) => a.modelId === "click-160"));
  });

  it("partial stock stays available (capacity 2, one overlap)", () => {
    const a = checkAvailability("grand-filano", "kamala", d(14), d(20));
    assert.equal(a.available, true);
    assert.equal(a.freeUnits, 1);
    assert.deepEqual([...a.conflicts], ["LR-SAMPLE-0103"]);
  });

  it("rejects invalid dates (before tomorrow / end not after start)", () => {
    const st = applyZone("rawai");
    assert.equal(applyDates(st, addDays(phuketTomorrow(), -2), d(10), phuketTomorrow()).ok, false);
    assert.equal(applyDates(st, d(10), d(10), phuketTomorrow()).ok, false);
    assert.equal(applyDates(st, d(10), d(5), phuketTomorrow()).ok, false);
    assert.equal(applyDates(st, "", d(5), phuketTomorrow()).ok, false);
  });
});
