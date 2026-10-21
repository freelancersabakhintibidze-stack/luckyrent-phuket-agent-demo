import type { Metadata } from "next";
import { FLEET, RATING, ZONES } from "@/data/fleet";
import { formatBaht } from "@/lib/format";
import { SITE_URL, ogImageUrl } from "@/lib/site";

const TITLE = "Provenance: every data point and its source";
const DESCRIPTION =
  "Point-by-point table of every real data point used in this demo (source URL + fetch date 2026-10-20) and a full inventory of the invented SAMPLE seeds.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/provenance" },
  openGraph: {
    title: `${TITLE} · Luckyrent Phuket agent demo`,
    description: DESCRIPTION,
    url: `${SITE_URL}/provenance`,
    images: [{ url: ogImageUrl("Provenance · Luckyrent agent demo"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [ogImageUrl("Provenance · Luckyrent agent demo")] },
};

const FETCHED = "2026-10-20";
const HOME = "https://luckyrent-phuket.com/";

type Row = { point: string; value: string; source: string; url?: string };

const REAL_ROWS: Row[] = [
  {
    point: "Brand & business",
    value: "Lucky Rent / Luckyrent Phuket, motorbike & scooter rental, Phuket",
    source: "homepage",
    url: HOME,
  },
  {
    point: "Rating line",
    value: `${RATING.score.toFixed(1)} / 5 from ${RATING.reviews} Google reviews`,
    source: "homepage (Elfsight Google reviews widget)",
    url: HOME,
  },
  {
    point: "Headline price",
    value: "motorbike rental from 130 \u0e3f/day (about $4)",
    source: "homepage title",
    url: HOME,
  },
  {
    point: "Value prop: delivery",
    value: "delivery all over Phuket, to your place",
    source: "homepage",
    url: HOME,
  },
  {
    point: "Value prop: gear",
    value: "2 helmets and 2 raincoats, free",
    source: "homepage",
    url: HOME,
  },
  {
    point: "Value prop: phone holder",
    value: "free phone holder on every bike",
    source: "homepage",
    url: HOME,
  },
  {
    point: "Value prop: insurance",
    value: "insurance for rider and passenger",
    source: "homepage",
    url: HOME,
  },
  {
    point: "Delivery promise",
    value: "bike delivered in 60 minutes",
    source: "Bang Tao location page",
    url: "https://luckyrent-phuket.com/location/bang-tao-beach/",
  },
  {
    point: "Staff hours",
    value: "new bookings 09:00-21:00; support 10:00-20:00",
    source: "Luckyrent Telegram bio (as provided in the project data block; not a public web URL)",
  },
  ...FLEET.map((m) => ({
    point: `Fleet: ${m.name}`,
    value: `load ${m.loadKg} kg · max ${m.maxSpeedKmh} km/h · comfortable ${m.comfortableSpeedKmh} km/h · tiers ${formatBaht(m.tiers[7], "en")} / ${formatBaht(m.tiers[14], "en")} / ${formatBaht(m.tiers[21], "en")} / ${formatBaht(m.tiers[30], "en")} (7/14/21/30 d)`,
    source: m.sourceUrl === HOME ? "homepage fleet section" : "product page",
    url: m.sourceUrl,
  })),
  {
    point: "Delivery zones",
    value: ZONES.map((z) => z.name).join(" · "),
    source: "location pages (Bang Tao, Kamala, Rawai) + homepage island-wide promise",
    url: "https://luckyrent-phuket.com/location/",
  },
  {
    point: 'Review quote: "Very understanding fast, fast anwer, I love it"',
    value: "Jordan Guerin",
    source: "public reviews widget on their homepage (Elfsight)",
    url: HOME,
  },
  {
    point: 'Review quote: "Well maintained bikes and good rates. This is my second time using their services."',
    value: "A. Zinbi",
    source: "public reviews widget on their homepage (Elfsight)",
    url: HOME,
  },
];

const SAMPLE_ROWS: Row[] = [
  {
    point: "Seeded stock & sample bookings",
    value: "unit capacities per model (2-3) and 7 sample bookings LR-SAMPLE-0101 … 0107 with fixed date windows",
    source: "used by the booking flow to check availability and demonstrate honest refusal of double-booked overlaps (conflicts are named). Deterministic, static, invented.",
  },
  {
    point: "Seeded inbox conversations",
    value: "6 conversations (2 EN, 2 RU, 1 UA, 1 TH) incl. 2 finished sample booking cards LR-SAMPLE-0201 / 0202",
    source: "owner console inbox. Totals on sample cards are computed from the REAL tier price list.",
  },
  {
    point: "Seeded audit rows",
    value: "8 rows dated 2026-10-20 01:12-09:02 (Phuket)",
    source: "owner console audit log. Rows you add during a visit (LR-DEMO-…) are live demo rows in your browser only.",
  },
  {
    point: "KPI seeds",
    value: "84 messages/week · 38% outside staff hours · 62 answered vs 22 escalated · 9 finished handovers/week · 4 min avg handle → 4.1 h returned/week",
    source: "owner console KPI row. Illustration of mechanics, not Luckyrent measurements. Formulas shown under each figure.",
  },
  {
    point: "Calculator seeds",
    value: "6 night messages/day · 25% close rate · avg rental 7 d",
    source: "revenue-leak calculator. The 230 ฿/day default is DERIVED from real data (Scoopy 7-day tier 1,610 ฿ ÷ 7). Outputs inherit the SAMPLE label.",
  },
  {
    point: "Simulated latency",
    value: "400 ms typing delay; caption shows the measured elapsed time ('answered in 0.4 s')",
    source: "chat widget. The wait-until-morning comparison refers to the REAL staff hours 09:00-21:00.",
  },
  {
    point: "Demo booking refs",
    value: "LR-DEMO-0001, 0002, … per browser session",
    source: "created when you complete a booking in the demo chat; stored in your browser's localStorage; nothing is sent anywhere.",
  },
];

export default function ProvenancePage() {
  return (
    <div className="container section">
      <div className="prose">
        <p className="updated">Fetch date for all real data: {FETCHED}</p>
        <h1>Provenance</h1>
        <p>
          This demo runs under a hard truth contract: <strong>every statement, price and metric is
          either traceable to the real sources below, or visibly labeled SAMPLE</strong>
          (&ldquo;simulated for demonstration&rdquo;). This page is the full ledger. Calculated
          figures (totals, daily rates, KPIs, revenue-leak outputs) are derived from these inputs
          with the formula displayed next to each number in the UI.
        </p>

        <h2>A. Real data (public luckyrent-phuket.com + Telegram bio)</h2>
        <div className="prov-table-wrap">
          <table className="prov">
            <thead>
              <tr>
                <th scope="col">Data point</th>
                <th scope="col">Value used in this demo</th>
                <th scope="col">Source</th>
                <th scope="col">Fetched</th>
              </tr>
            </thead>
            <tbody>
              {REAL_ROWS.map((r) => (
                <tr key={r.point}>
                  <td className="data">{r.point}</td>
                  <td>{r.value}</td>
                  <td>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.source}
                      </a>
                    ) : (
                      r.source
                    )}
                  </td>
                  <td className="data">{FETCHED}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Review quotes are used verbatim, with reviewer names, exactly as published in the public
          widget on their site. No other reviews or testimonials appear anywhere in this demo.
        </p>

        <h2>B. SAMPLE seeds (invented for illustration, labeled in the UI)</h2>
        <div className="prov-table-wrap">
          <table className="prov">
            <thead>
              <tr>
                <th scope="col">Sample item</th>
                <th scope="col">Values</th>
                <th scope="col">Where it appears / note</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((r) => (
                <tr key={r.point}>
                  <td className="data">{r.point}</td>
                  <td>{r.value}</td>
                  <td>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>C. What is NOT in this demo</h2>
        <ul>
          <li>No real customer data, no real bookings, no real payments.</li>
          <li>
            No deposit figures: deposit terms are not published in the source data, so the agent
            says exactly that and escalates to the manager instead of guessing.
          </li>
          <li>No revenue claims about Luckyrent: calculator outputs are SAMPLE arithmetic.</li>
          <li>No impersonation: every page carries the independent-demo banner and this ledger.</li>
        </ul>
      </div>
    </div>
  );
}
