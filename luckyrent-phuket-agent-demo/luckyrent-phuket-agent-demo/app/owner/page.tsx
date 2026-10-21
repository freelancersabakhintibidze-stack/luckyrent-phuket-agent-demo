import type { Metadata } from "next";
import AuditLog from "@/components/AuditLog";
import CoverageClock from "@/components/CoverageClock";
import FaqBlock from "@/components/FaqBlock";
import InboxView from "@/components/InboxView";
import KpiRow from "@/components/KpiRow";
import RevenueCalculator from "@/components/RevenueCalculator";
import SectionDivider, { PanelHeading } from "@/components/SectionDivider";
import { DEMO_DESCRIPTION, SITE_URL, ogImageUrl } from "@/lib/site";

const TITLE = "Owner console (DEMO data)";
const DESCRIPTION =
  "What the agent handled while you slept: coverage clock, KPI row with formulas, revenue-leak calculator, inbox of finished bookings, and an append-only audit log. All demo data, labeled DEMO/SAMPLE.";

export const metadata: Metadata = {
  title: TITLE,
  description: DEMO_DESCRIPTION,
  alternates: { canonical: "/owner" },
  openGraph: {
    title: `${TITLE} · Luckyrent Phuket agent demo`,
    description: DESCRIPTION,
    url: `${SITE_URL}/owner`,
    images: [{ url: ogImageUrl("Owner console · Luckyrent agent demo"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Luckyrent Phuket agent demo`,
    description: DESCRIPTION,
    images: [ogImageUrl("Owner console · Luckyrent agent demo")],
  },
};

export default function OwnerPage() {
  return (
    <>
      <div className="container owner-head">
        <p className="eyebrow">Surface B · for the owner</p>
        <h1>
          What the agent handled while you slept{" "}
          <span className="tag tag-demo" title="simulated for demonstration" style={{ verticalAlign: "middle" }}>
            DEMO data
          </span>
        </h1>
        <p className="sub">
          Seeded rows on this page are labeled SAMPLE (invented for illustration). Anything you
          create in the landing chat during this visit is labeled DEMO and lives in your browser
          only. Every calculated figure shows its formula; nothing here is sent to Luckyrent.
        </p>
      </div>

      <section className="section" aria-labelledby="night-h" style={{ paddingTop: 36 }}>
        <div className="container">
          <SectionDivider num="I" title="The coverage gap" />
          <PanelHeading eyebrow="Real hours · SAMPLE traffic">
            <span id="night-h">Twelve hours a day, nobody is listening</span>
          </PanelHeading>
          <div className="owner-grid">
            <CoverageClock />
            <KpiRow />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="leak-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="II" title="Revenue leak" />
          <PanelHeading eyebrow="Interactive · every input SAMPLE">
            <span id="leak-h">The cost of answering in the morning</span>
          </PanelHeading>
          <RevenueCalculator />
        </div>
      </section>

      <section className="section" aria-labelledby="inbox-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="III" title="Inbox" />
          <PanelHeading eyebrow="Finished bookings first · raw chats never">
            <span id="inbox-h">What lands on the manager&rsquo;s desk</span>
          </PanelHeading>
          <InboxView />
        </div>
      </section>

      <section className="section" aria-labelledby="audit-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="IV" title="Audit log" />
          <PanelHeading eyebrow="Append-only · mono">
            <span id="audit-h">Every mutation leaves a trail</span>
          </PanelHeading>
          <AuditLog />
        </div>
      </section>

      <section className="section" aria-labelledby="faq-h" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionDivider num="V" title="FAQ" />
          <PanelHeading eyebrow="Three honest answers">
            <span id="faq-h">Questions the owner should ask</span>
          </PanelHeading>
          <FaqBlock />
        </div>
      </section>
    </>
  );
}
