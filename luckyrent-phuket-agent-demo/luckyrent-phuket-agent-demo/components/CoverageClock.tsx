import { STAFF_HOURS } from "@/data/fleet";

/**
 * Coverage clock: circular 24h dial. The gold band is their published staff
 * hours for new bookings (09:00-21:00, source: their Telegram bio); the moss
 * inner band is support hours (10:00-20:00). The dark complement is the time
 * messages currently wait. Static SVG, no animation.
 */

const CX = 110;
const CY = 110;

function polar(hour: number, r: number): { x: number; y: number } {
  const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

export default function CoverageClock() {
  const staffedStart = Number(STAFF_HOURS.bookings.start.slice(0, 2));
  const staffedEnd = Number(STAFF_HOURS.bookings.end.slice(0, 2));
  const staffedHours = staffedEnd - staffedStart; // 12
  const unstaffed = 24 - staffedHours; // 13

  const ticks = Array.from({ length: 24 }, (_, h) => {
    const major = h % 3 === 0;
    const a = polar(h, major ? 88 : 90);
    const b = polar(h, major ? 95 : 93);
    return { h, major, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });

  return (
    <div className="panel clock-panel">
      <h2>Coverage clock</h2>
      <svg
        className="clock-svg"
        viewBox="0 0 220 220"
        role="img"
        aria-label={`24 hour coverage dial. Staff take new bookings from ${STAFF_HOURS.bookings.start} to ${STAFF_HOURS.bookings.end}; the remaining ${unstaffed} hours per day messages wait. Source: their Telegram bio.`}
      >
        <g transform={`rotate(-90 ${CX} ${CY})`}>
          {/* 24h track (the waiting complement) */}
          <circle
            cx={CX}
            cy={CY}
            r={80}
            fill="none"
            stroke="rgba(245,245,220,0.10)"
            strokeWidth={11}
            pathLength={24}
          />
          {/* staffed bookings band 09:00-21:00 */}
          <circle
            cx={CX}
            cy={CY}
            r={80}
            fill="none"
            stroke="#1A4D2E"
            strokeWidth={11}
            pathLength={24}
            strokeDasharray={`0 ${staffedStart} ${staffedHours} ${24 - staffedStart - staffedHours}`}
          />
          <circle
            cx={CX}
            cy={CY}
            r={80}
            fill="none"
            stroke="rgba(201,162,39,0.55)"
            strokeWidth={1.5}
            pathLength={24}
            strokeDasharray={`0 ${staffedStart} ${staffedHours} ${24 - staffedStart - staffedHours}`}
          />
          {/* support band 10:00-20:00 (inner, thinner) */}
          <circle
            cx={CX}
            cy={CY}
            r={66}
            fill="none"
            stroke="rgba(143,188,143,0.5)"
            strokeWidth={3}
            pathLength={24}
            strokeDasharray="0 10 10 4"
          />
        </g>
        {/* hour ticks */}
        {ticks.map((tk) => (
          <line
            key={tk.h}
            x1={tk.x1}
            y1={tk.y1}
            x2={tk.x2}
            y2={tk.y2}
            stroke={tk.major ? "rgba(201,162,39,0.7)" : "rgba(245,245,220,0.22)"}
            strokeWidth={tk.major ? 1.4 : 1}
          />
        ))}
        {/* major hour labels */}
        {[0, 6, 12, 18].map((h) => {
          const p = polar(h, 104);
          return (
            <text
              key={h}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(245,245,220,0.62)"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}
            >
              {String(h).padStart(2, "0")}
            </text>
          );
        })}
        {/* center read-out */}
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fill="#D4AF37"
          style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 500 }}
        >
          {unstaffed} h
        </text>
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          fill="rgba(245,245,220,0.75)"
          style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.04em" }}
        >
          PER DAY MESSAGES WAIT
        </text>
        <text
          x={CX}
          y={CY + 30}
          textAnchor="middle"
          fill="rgba(245,245,220,0.6)"
          style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
        >
          staffed {STAFF_HOURS.bookings.start}-{STAFF_HOURS.bookings.end}
        </text>
      </svg>
      <div className="clock-legend">
        <span className="lg">
          <span className="swatch" style={{ background: "#1A4D2E", border: "1px solid rgba(201,162,39,0.55)" }} />
          <span>
            <strong>{STAFF_HOURS.bookings.start}-{STAFF_HOURS.bookings.end}</strong> staff take new
            bookings <span className="src-note">(source: their Telegram bio)</span>
          </span>
        </span>
        <span className="lg">
          <span className="swatch" style={{ background: "rgba(143,188,143,0.5)" }} />
          <span>
            <strong>{STAFF_HOURS.support.start}-{STAFF_HOURS.support.end}</strong> support hours{" "}
            <span className="src-note">(source: their Telegram bio)</span>
          </span>
        </span>
        <span className="lg">
          <span className="swatch" style={{ background: "rgba(245,245,220,0.10)" }} />
          <span>
            <strong>the other {unstaffed} h/day</strong> messages currently wait{" "}
            <span className="src-note">(derived: 24 h &minus; 12 h staffed)</span>
          </span>
        </span>
      </div>
    </div>
  );
}
