import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FLEET, getModel } from "@/data/fleet";
import { nearestTier, priceRental } from "@/lib/pricing";

const scoopy = getModel("scoopy-110")!;
const click160 = getModel("click-160")!;
const filano = getModel("grand-filano")!;
const lead = getModel("lead-125")!;

describe("priceRental: exact tiers (real Section 3 prices)", () => {
  it("Scoopy 7 d = 1,610", () => {
    assert.equal(priceRental(scoopy, 7).total, 1610);
    assert.equal(priceRental(scoopy, 7).basis.kind, "exact-tier");
  });
  it("Scoopy 14 d = 2,520 (the brief's reference case)", () => {
    const r = priceRental(scoopy, 14);
    assert.equal(r.total, 2520);
    assert.equal(r.daily, 180); // 2520 / 14
    assert.equal(r.basis.kind, "exact-tier");
  });
  it("Scoopy 21 d = 3,360 and 30 d = 4,000", () => {
    assert.equal(priceRental(scoopy, 21).total, 3360);
    assert.equal(priceRental(scoopy, 30).total, 4000);
  });
  it("Click 160 21 d = 3,900; Filano 14 d = 2,940; Lead 30 d = 4,000", () => {
    assert.equal(priceRental(click160, 21).total, 3900);
    assert.equal(priceRental(filano, 14).total, 2940);
    assert.equal(priceRental(lead, 30).total, 4000);
  });
});

describe("priceRental: pro-rated edge durations (nearest tier daily rate)", () => {
  it("1 d -> nearest tier 7 d: 1 x (1610/7) = 230", () => {
    const r = priceRental(scoopy, 1);
    assert.equal(nearestTier(scoopy, 1), 7);
    assert.equal(r.total, 230);
    assert.equal(r.basis.kind, "nearest-tier");
  });
  it("6 d -> nearest tier 7 d: 6 x 230 = 1,380", () => {
    assert.equal(priceRental(scoopy, 6).total, 1380);
  });
  it("8 d -> nearest tier 7 d: 8 x 230 = 1,840", () => {
    assert.equal(priceRental(scoopy, 8).total, 1840);
  });
  it("29 d -> nearest tier 30 d: round(29 x 4000/30) = 3,867", () => {
    const r = priceRental(scoopy, 29);
    assert.equal(nearestTier(scoopy, 29), 30);
    assert.equal(r.total, 3867);
  });
  it("45 d -> nearest tier 30 d: round(45 x 4000/30) = 6,000", () => {
    const r = priceRental(scoopy, 45);
    assert.equal(nearestTier(scoopy, 45), 30);
    assert.equal(r.total, 6000);
  });
  it("10 d Click 160 -> nearest tier 7 d: round(10 x 1800/7) = 2,571", () => {
    const r = priceRental(click160, 10);
    assert.equal(nearestTier(click160, 10), 7);
    assert.equal(r.total, 2571);
  });
  it("17 d Filano -> nearest tier 14 d: 17 x 210 = 3,570", () => {
    const r = priceRental(filano, 17);
    assert.equal(nearestTier(filano, 17), 14);
    assert.equal(r.total, 3570);
  });
  it("every result carries a formula string (truth contract)", () => {
    for (const m of FLEET) {
      for (const days of [1, 6, 7, 8, 14, 21, 29, 30, 45]) {
        const r = priceRental(m, days);
        assert.ok(r.formula.length > 5, `${m.id}/${days} missing formula`);
        assert.ok(Number.isInteger(r.total) && r.total > 0);
      }
    }
  });
  it("rejects non-positive / non-integer durations", () => {
    assert.throws(() => priceRental(scoopy, 0));
    assert.throws(() => priceRental(scoopy, -3));
    assert.throws(() => priceRental(scoopy, 2.5));
  });
});
