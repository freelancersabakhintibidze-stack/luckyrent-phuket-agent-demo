import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import FleetStrip from "@/components/FleetStrip";
import SectionDivider, { PanelHeading } from "@/components/SectionDivider";
import ZonesStrip from "@/components/ZonesStrip";
import {
  FLEET,
  HEADLINE_PRICE,
  RATING,
  REVIEW_QUOTES,
  STAFF_HOURS,
  VALUE_PROPS,
} from "@/data/fleet";
import { DEMO_DESCRIPTION, DEMO_TITLE, SITE_URL, ogImageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "24/7 booking agent demo",
  description: DEMO_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: DEMO_TITLE,
    description: DEMO_DESCRIPTION,
    url: `${SITE_URL}/`,
    images: [{ url: ogImageUrl(DEMO_TITLE), width: 1200, height: 630, alt: DEMO_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEMO_TITLE,
    description: DEMO_DESCRIPTION,
    images: [ogImageUrl(DEMO_TITLE)],
  },
};

const FACT_SOURCES: Record<string, string> = {
  delivery: "source: homepage + Bang Tao page (60 min)",
  gear: "source: their homepage",
  holder: "source: their homepage",
  insurance: "source: their homepage",
};

const FACT_TEXT: Record<string, string> = {
  delivery: "Delivery island-wide, to your place. About 60 minutes in Bang Tao.",
  gear: "2 helmets + 2 raincoats, free with every bike.",
  holder: "Free phone holder on every bike.",
  insurance: "Insurance for rider and passenger.",
};

export default function LandingPage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-main">
            <div className="kicker">
              <span className="eyebrow">Independent demo · free gift · no call, no installation</span>
              <span className="tag tag-demo" title="simulated for demonstration">DEMO</span>
            </div>
            <h1>Luckyrent Phuket</h1>
            <p className="brand-sub">24/7 booking agent demo</p>
            <p className="lede">
              A working demo of the booking agent that answers your visitors <strong>24/7 in EN, RU,
              UA and TH</strong> using only your published data, and hands you{" "}
              <strong>only finished bookings</strong>. Staff take bookings{" "}
              <span className="mono">{STAFF_HOURS.bookings.start}-{STAFF_HOURS.bookings.end}</span>{" "}
              (your Telegram bio); the agent covers the rest of the day. Prepared independently by
              Saba Khintibidze as a free gift.
            </p>
            <div className="hero-cta">
              <a href="#agent" className="btn btn-solid">Try the agent</a>
              <a href="/owner" className="btn">Open owner console</a>
            </div>
            <p className="viewing-path">
              2-MINUTE PATH: one chat answer → one finished booking card → owner inbox. No login, no
              setup.
            </p>
          </div>
          <aside className="hero-aside" aria-label="Key facts">
            <div className="stat-card">
              <p className="rating-line tnum">
                <span className="score">{RATING.score.toFixed(1)}</span> · {RATING.reviews} Google
                reviews <span className="dim">(source: luckyrent-phuket.com)</span>
              </p>
              <p className="headline-price tnum">
                motorbike rental {HEADLINE_PRICE.text} · their homepage headline
              </p>
            </div>
            <ul className="facts">
              {VALUE_PROPS.map((vp, i) => (
                <li key={vp.id}>
                  <span className="fact-num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fact-text">
                    {FACT_TEXT[vp.id] ?? vp.en}
                    <span className="fact-src">{FACT_SOURCES[vp.id]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ---------------- I · THE AGENT ---------------- */}
      <section className="section" id="agent" aria-labelledby="agent-h">
        <div className="container">
          <SectionDivider num="I" title="The agent" />
          <PanelHeading eyebrow="Live widget · EN / RU / UA / TH">
            <span id="agent-h">Ask it anything your visitors ask at 2 a.m.</span>
          </PanelHeading>
          <ChatWidget />
          <p className="fleet-note" style={{ marginTop: 14 }}>
            The demo agent is a deterministic scripted engine over published data (no LLM, no
            network calls). The production agent would be LLM-backed with this same UX and the same
            honesty rules: never invent, escalate what is not public. Fleet in scope:{" "}
            {FLEET.length} models, {VALUE_PROPS.length} published value props.
          </p>
        </div>
      </section>

      {/* ---------------- II · THE FLEET ---------------- */}
      <section className="section" aria-labelledby="fleet-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="II" title="The fleet" />
          <PanelHeading eyebrow="Real models · real tier prices">
            <span id="fleet-h">Six bikes, four tiers, zero invented numbers</span>
          </PanelHeading>
          <FleetStrip />
        </div>
      </section>

      {/* ---------------- III · ZONES ---------------- */}
      <section className="section" aria-labelledby="zones-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="III" title="Delivery zones" />
          <PanelHeading eyebrow="Bang Tao · Kamala · Rawai · all Phuket">
            <span id="zones-h">Delivered to the customer, not the other way around</span>
          </PanelHeading>
          <ZonesStrip />
        </div>
      </section>

      {/* ---------------- PULL QUOTE ---------------- */}
      <div className="container">
        <figure className="pull-quote">
          <blockquote>
            &ldquo;The booking is finished <em>before the manager wakes up.</em>&rdquo;
          </blockquote>
          <figcaption>The promise of this demo</figcaption>
        </figure>
      </div>

      {/* ---------------- IV · THE HANDOVER ---------------- */}
      <section className="section" aria-labelledby="handover-h">
        <div className="container">
          <SectionDivider num="IV" title="The handover" />
          <PanelHeading eyebrow="How the demo works end to end">
            <span id="handover-h">The manager receives results, not chat logs</span>
          </PanelHeading>
          <ol className="promise-list">
            <li>
              <span className="step-num">I</span>
              <div>
                <h3>Answers 24/7, in four languages</h3>
                <p>
                  Published staff hours are {STAFF_HOURS.bookings.start}-{STAFF_HOURS.bookings.end}{" "}
                  for bookings and {STAFF_HOURS.support.start}-{STAFF_HOURS.support.end} for support
                  (their Telegram bio). Outside those hours the agent answers instantly from
                  published data, and escalates honestly when something (like deposit terms) is not
                  public.
                </p>
              </div>
            </li>
            <li>
              <span className="step-num">II</span>
              <div>
                <h3>Collects the slots, checks availability</h3>
                <p>
                  Zone, dates, model. Availability is a deterministic seeded stock (labeled SAMPLE)
                  so the flow is reproducible: overlapping dates are refused and the conflicting
                  booking refs are named, with free alternatives offered.
                </p>
              </div>
            </li>
            <li>
              <span className="step-num">III</span>
              <div>
                <h3>Hands over only finished bookings</h3>
                <p>
                  The owner inbox receives a booking card: zone, model, dates, total from the real
                  tier prices with the formula shown, delivery window, and the open questions list.
                  Every hand-over writes one audit row. Raw questions never reach the manager.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------------- V · ON THE RECORD ---------------- */}
      <section className="section" aria-labelledby="record-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="V" title="On the record" />
          <PanelHeading eyebrow="Their own reviews widget">
            <span id="record-h">Two public reviews, quoted verbatim</span>
          </PanelHeading>
          <div className="reviews">
            {REVIEW_QUOTES.map((r) => (
              <figure className="review" key={r.author}>
                <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                <div className="attrib">{r.author}</div>
                <div className="label">{r.label} · {RATING.score.toFixed(1)} / 5 from {RATING.reviews} Google reviews</div>
              </figure>
            ))}
          </div>
          <p className="fleet-note" style={{ marginTop: 16 }}>
            Only these two quotes are used, exactly as published in the Elfsight widget on their
            homepage (fetched 2026-10-20). No testimonials were invented for this demo.
          </p>
        </div>
      </section>
    </>
  );
}
