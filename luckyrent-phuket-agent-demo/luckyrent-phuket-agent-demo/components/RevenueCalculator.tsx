"use client";

import { useState } from "react";
import { CALC_DEFAULTS } from "@/data/seed";
import { formatBaht, formatNumber } from "@/lib/format";

/**
 * Revenue-leak calculator. Interactive, defaults editable.
 * Formula (shown inline, from the brief):
 *   lost bookings/month = night_msgs x 30 x close_rate
 *   lost revenue/month  = lost x avg_days(7) x daily_rate
 * Every input is visibly marked SAMPLE. The default daily rate is derived
 * from REAL data: Scoopy 7-day tier 1,610 / 7 = 230.
 */
export default function RevenueCalculator() {
  const [dailyRate, setDailyRate] = useState<number>(CALC_DEFAULTS.dailyRateBaht);
  const [nightMsgs, setNightMsgs] = useState<number>(CALC_DEFAULTS.nightMessagesPerDay);
  const [closePct, setClosePct] = useState<number>(CALC_DEFAULTS.closeRatePct);
  const avgDays = CALC_DEFAULTS.avgRentalDays;

  const clamp = (n: number, min: number, max: number) =>
    Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;

  const dr = clamp(dailyRate, 0, 5000);
  const nm = clamp(nightMsgs, 0, 100);
  const cr = clamp(closePct, 0, 100);

  const lost = nm * 30 * (cr / 100);
  const lostRounded = Math.round(lost);
  const revenue = Math.round(lost * avgDays * dr);

  const reset = () => {
    setDailyRate(CALC_DEFAULTS.dailyRateBaht);
    setNightMsgs(CALC_DEFAULTS.nightMessagesPerDay);
    setClosePct(CALC_DEFAULTS.closeRatePct);
  };

  return (
    <div className="panel calc" data-testid="revenue-calculator">
      <p className="eyebrow" style={{ marginBottom: 10 }}>Revenue leak · interactive</p>
      <h2>What the waiting hours cost</h2>
      <p className="calc-sub">
        Night messages arrive while nobody answers (staff take bookings 09:00-21:00, their Telegram
        bio). Some fraction would have closed. Change any input; the math is shown under every
        figure so you can verify it yourself.
      </p>
      <div className="calc-grid">
        <div className="calc-inputs">
          <div className="calc-field">
            <label htmlFor="calc-rate">
              average daily rate, ฿ <span className="tag tag-sample" title="simulated for demonstration">SAMPLE</span>
            </label>
            <div className="row">
              <input
                id="calc-rate"
                type="number"
                min={0}
                max={5000}
                step={10}
                value={dailyRate}
                data-testid="calc-rate"
                onChange={(e) => setDailyRate(Number(e.target.value))}
              />
              <input
                type="range"
                min={100}
                max={1000}
                step={10}
                value={Math.min(1000, dr)}
                aria-label="average daily rate slider"
                onChange={(e) => setDailyRate(Number(e.target.value))}
              />
            </div>
            <p className="derive">
              default derived from REAL data: Scoopy 7-day tier 1,610 ฿ ÷ 7 = 230 ฿/day (their
              price list)
            </p>
          </div>
          <div className="calc-field">
            <label htmlFor="calc-msgs">
              night messages / day <span className="tag tag-sample" title="simulated for demonstration">SAMPLE</span>
            </label>
            <div className="row">
              <input
                id="calc-msgs"
                type="number"
                min={0}
                max={100}
                step={1}
                value={nightMsgs}
                data-testid="calc-msgs"
                onChange={(e) => setNightMsgs(Number(e.target.value))}
              />
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={Math.min(30, nm)}
                aria-label="night messages slider"
                onChange={(e) => setNightMsgs(Number(e.target.value))}
              />
            </div>
            <p className="derive">SAMPLE seed: 6 messages/night (illustration, not measured data)</p>
          </div>
          <div className="calc-field">
            <label htmlFor="calc-close">
              close rate, % <span className="tag tag-sample" title="simulated for demonstration">SAMPLE</span>
            </label>
            <div className="row">
              <input
                id="calc-close"
                type="number"
                min={0}
                max={100}
                step={1}
                value={closePct}
                data-testid="calc-close"
                onChange={(e) => setClosePct(Number(e.target.value))}
              />
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={cr}
                aria-label="close rate slider"
                onChange={(e) => setClosePct(Number(e.target.value))}
              />
            </div>
            <p className="derive">SAMPLE seed: 25% of night messages would have become rentals</p>
          </div>
          <button type="button" className="btn btn-small" onClick={reset} style={{ alignSelf: "flex-start" }}>
            Reset defaults
          </button>
        </div>
        <div className="calc-out" aria-live="polite">
          <div className="out-cell">
            <p className="out-label">estimated lost bookings / month</p>
            <p className="out-v tnum" data-testid="lost-bookings">
              {formatNumber(lostRounded, "en")}
            </p>
            <p className="out-formula" data-testid="lost-formula">
              lost = {nm} night msgs × 30 days × {cr}% = {formatNumber(lostRounded, "en")} bookings/month
            </p>
          </div>
          <div className="out-cell">
            <p className="out-label">estimated lost revenue / month</p>
            <p className="out-v tnum" data-testid="lost-revenue">
              {formatBaht(revenue, "en")}
            </p>
            <p className="out-formula" data-testid="revenue-formula">
              revenue = {formatNumber(lostRounded, "en")} lost × {avgDays} d × {formatNumber(dr, "en")} ฿/d ={" "}
              {formatBaht(revenue, "en")}/month
            </p>
          </div>
          <p className="calc-disclaimer">
            avg_days is fixed at 7 (the 7-day tier basis, real tier). All three inputs are SAMPLE
            assumptions for illustration, not Luckyrent measurements; outputs inherit that label.
            Nothing here is a revenue claim about the real business.
          </p>
        </div>
      </div>
    </div>
  );
}
