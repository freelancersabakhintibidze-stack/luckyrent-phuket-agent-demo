"use client";

import { ZONES } from "@/data/fleet";
import { emitPrefill } from "@/lib/bus";

/** Real delivery zones (their location pages) + island-wide promise. */
export default function ZonesStrip() {
  return (
    <div>
      <ul className="zones-list">
        {ZONES.map((z) => (
          <li key={z.id}>
            <span className="zone-name">{z.name}</span>
            <span>
              <span className="zone-promise">bike delivered in ~60 minutes</span>
              <span className="zone-note" style={{ display: "block", marginTop: 4 }}>
                {z.note}
              </span>
            </span>
            <span className="zone-actions">
              <button
                type="button"
                className="btn btn-small"
                data-testid={`book-zone-${z.id}`}
                onClick={() => emitPrefill({ kind: "start-booking", zoneId: z.id })}
              >
                Book here
              </button>
              <a className="src-note" href={z.sourceUrl} target="_blank" rel="noopener noreferrer">
                source
              </a>
            </span>
          </li>
        ))}
      </ul>
      <p className="fleet-note">
        Zones: their Bang Tao, Kamala and Rawai location pages; the homepage promises delivery all
        over Phuket. The 60-minute promise is from their Bang Tao page (source linked per row).
      </p>
    </div>
  );
}
