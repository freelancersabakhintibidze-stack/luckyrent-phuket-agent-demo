import { KPI_SEED } from "@/data/seed";

/**
 * KPI row. Every value is a SAMPLE seed (invented for illustration, labeled),
 * and every calculated figure shows its formula right under the number.
 */

type Cell = {
  value: string;
  label: string;
  formula: string;
};

export default function KpiRow() {
  const k = KPI_SEED;
  const outsideMsgs = Math.round((k.messagesPerWeek * k.outsideStaffSharePct) / 100);
  const answeredPct = Math.round((k.answeredByAgent / k.messagesPerWeek) * 100);
  const escalatedPct = Math.round((k.escalatedToHuman / k.messagesPerWeek) * 100);

  const cells: Cell[] = [
    {
      value: String(k.messagesPerWeek),
      label: "messages / week",
      formula: "SAMPLE seed value (illustration, not Luckyrent data)",
    },
    {
      value: `${k.outsideStaffSharePct}%`,
      label: "arrive outside staff hours 09:00-21:00",
      formula: `${k.messagesPerWeek} msgs/wk \u00d7 ${k.outsideStaffSharePct}% \u2248 ${outsideMsgs} msgs/wk wait until morning (SAMPLE seed share)`,
    },
    {
      value: `${k.answeredByAgent} / ${k.messagesPerWeek}`,
      label: "answered by agent",
      formula: `${k.answeredByAgent} \u00f7 ${k.messagesPerWeek} = ${answeredPct}% (SAMPLE)`,
    },
    {
      value: `${k.escalatedToHuman} / ${k.messagesPerWeek}`,
      label: "escalated to human",
      formula: `${k.escalatedToHuman} \u00f7 ${k.messagesPerWeek} = ${escalatedPct}% (SAMPLE)`,
    },
    {
      value: String(k.finishedHandoversPerWeek),
      label: "finished bookings handed over / week",
      formula: "SAMPLE seed value (only finished bookings are handed over)",
    },
    {
      value: `${k.staffHoursReturnedPerWeek} h`,
      label: "estimated staff hours returned / week",
      formula: `${k.answeredByAgent} answered \u00d7 ${k.avgHandleMinutes} min avg handle \u00f7 60 = ${((k.answeredByAgent * k.avgHandleMinutes) / 60).toFixed(1)} h (SAMPLE inputs)`,
    },
  ];

  return (
    <div>
      <div className="kpi-ledger" data-testid="kpi-ledger">
        {cells.map((c) => (
          <div className="kpi-cell" key={c.label} title={c.formula}>
            <span className="kpi-v">
              {c.value}{" "}
              <span className="tag tag-sample" title="simulated for demonstration">SAMPLE</span>
            </span>
            <span className="kpi-label">{c.label}</span>
            <span className="kpi-formula">{c.formula}</span>
          </div>
        ))}
      </div>
      <p className="src-note" style={{ marginTop: 12 }}>
        All KPI values are SAMPLE seeds chosen to illustrate the mechanics; none are Luckyrent
        measurements. Formulas are shown so every figure can be re-computed by hand.
      </p>
    </div>
  );
}
