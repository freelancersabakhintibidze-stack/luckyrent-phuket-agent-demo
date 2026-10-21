"use client";

import { useEffect, useState } from "react";
import { SEED_AUDIT } from "@/data/seed";
import { resetDemoStore, useDemoStore } from "@/lib/store";

/**
 * Audit log table. Append-only look, mono type: every mutation in the demo
 * (hand-overs) leaves a row, mirroring the production promise. Seeded rows are
 * SAMPLE; rows appended during this visit are live DEMO rows in browser storage.
 */
export default function AuditLog() {
  const store = useDemoStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div aria-busy="true" aria-label="Loading audit log (demo data)">
        <div className="skeleton skeleton-line" style={{ width: "30%" }} />
        <div className="skeleton skeleton-block" style={{ height: 220 }} />
      </div>
    );
  }

  const rows = store.audit;
  const liveCount = rows.length - SEED_AUDIT.length;

  return (
    <div data-testid="audit-log">
      <div className="audit-wrap">
        <table className="audit">
          <caption className="visually-hidden">
            Audit log: timestamp, actor, action, booking reference
          </caption>
          <thead>
            <tr>
              <th scope="col">timestamp (Phuket)</th>
              <th scope="col">actor</th>
              <th scope="col">action</th>
              <th scope="col">booking ref</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const live = i >= SEED_AUDIT.length;
              return (
                <tr key={`${r.ts}-${r.ref}-${i}`} className={live ? "row-live" : undefined} data-testid={live ? "audit-row-live" : "audit-row-seed"}>
                  <td>{r.ts}</td>
                  <td className={r.actor === "agent" ? "actor-agent" : "actor-human"}>{r.actor}</td>
                  <td>{r.action}</td>
                  <td className="ref">{r.ref}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="src-note" style={{ marginTop: 12 }}>
        rows: {rows.length} · seeded SAMPLE: {SEED_AUDIT.length} · live DEMO (this browser):{" "}
        {Math.max(0, liveCount)}. Every mutation leaves an audit trail; that is a production
        promise, demonstrated here. Live rows exist only in your browser&rsquo;s local storage.{" "}
        <button
          type="button"
          className="btn btn-small"
          style={{ marginLeft: 8, padding: "4px 10px" }}
          onClick={resetDemoStore}
          data-testid="reset-demo"
        >
          Reset demo data
        </button>
      </p>
    </div>
  );
}
