"use client";

import { FLEET } from "@/data/fleet";
import { formatBaht } from "@/lib/format";
import { emitPrefill } from "@/lib/bus";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/**
 * The six real models with real tier prices and specs (Section 3 data only).
 * Ruled editorial rows, not cards. "Ask the agent" pre-fills the chat.
 */
export default function FleetStrip() {
  return (
    <div>
      <div className="fleet-table">
        {FLEET.map((m, i) => (
          <div className="fleet-row" key={m.id}>
            <div>
              <div className="fleet-id">
                <span className="roman" aria-hidden="true">{ROMAN[i]}</span>
                <h3>{m.name}</h3>
              </div>
              <div className="fleet-specs">
                <span>load {m.loadKg} kg</span>
                <span>max {m.maxSpeedKmh} km/h</span>
                <span>comfortable {m.comfortableSpeedKmh} km/h</span>
              </div>
            </div>
            <div className="fleet-prices" aria-label={`${m.name} tier prices`}>
              <span className="tier"><span className="d">7 d</span><span className="p">{formatBaht(m.tiers[7], "en")}</span></span>
              <span className="tier"><span className="d">14 d</span><span className="p">{formatBaht(m.tiers[14], "en")}</span></span>
              <span className="tier"><span className="d">21 d</span><span className="p">{formatBaht(m.tiers[21], "en")}</span></span>
              <span className="tier"><span className="d">30 d</span><span className="p">{formatBaht(m.tiers[30], "en")}</span></span>
            </div>
            <button
              type="button"
              className="btn btn-small fleet-ask"
              data-testid={`ask-${m.id}`}
              onClick={() => emitPrefill({ kind: "ask-price", modelId: m.id })}
            >
              Ask the agent
            </button>
          </div>
        ))}
      </div>
      <p className="fleet-note">
        Prices, load caps and speeds: public luckyrent-phuket.com, fetched 2026-10-20 (real data,
        see /provenance). Other durations are pro-rated from the nearest tier; the agent shows the
        formula with every total.
      </p>
    </div>
  );
}
