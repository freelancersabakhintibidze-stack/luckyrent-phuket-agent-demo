import type { Metadata } from "next";
import { SITE_URL, ogImageUrl } from "@/lib/site";
import Link from "next/link";

const TITLE = "Terms of use (demo)";
const DESCRIPTION =
  "Terms of use for the independent Luckyrent Phuket booking agent demo by Saba Khintibidze. The demo is provided as-is; all conversations and bookings are simulated.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${TITLE} · Luckyrent Phuket agent demo`,
    description: DESCRIPTION,
    url: `${SITE_URL}/terms`,
    images: [{ url: ogImageUrl("Terms of use · Luckyrent agent demo"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [ogImageUrl("Terms of use · Luckyrent agent demo")] },
};

export default function TermsPage() {
  return (
    <div className="container section">
      <div className="prose">
        <p className="updated">Last updated: 2026-10-20</p>
        <h1>{TITLE}</h1>

        <h2>1. What this site is</h2>
        <p>
          This is an <strong>independent demonstration</strong> of an AI booking agent, prepared as
          a free gift for <strong>Luckyrent Phuket</strong> (motorbike and scooter rental, Phuket,
          Thailand) by Saba Khintibidze, an independent AI automation engineer. It is{" "}
          <strong>not the official Luckyrent website</strong>, not a Luckyrent service, and not a
          shop. Luckyrent has not reviewed, approved, or published this demo.
        </p>

        <h2>2. No real transactions</h2>
        <p>
          Every conversation, booking card, inbox item, KPI and audit row in this app is{" "}
          <strong>simulated for demonstration</strong> and labeled DEMO or SAMPLE. Pressing
          &ldquo;Hand to manager&rdquo; stores the demo booking in your own browser;{" "}
          <strong>nothing is sent to Luckyrent</strong> or to anyone else. Booking references
          starting with LR-DEMO or LR-SAMPLE are not real reservations and entitle nobody to a
          vehicle, a price, or a delivery. To rent a bike, contact Luckyrent through their official
          channels.
        </p>

        <h2>3. Data and accuracy</h2>
        <p>
          Fleet models, tier prices, specifications, delivery zones, value propositions, the
          4.7/743 review rating and staff hours were copied from the public luckyrent-phuket.com
          and their Telegram bio on <strong>2026-10-20</strong>; the full source list is on{" "}
          <Link href="/provenance">/provenance</Link>. Prices and terms change; for current
          information rely only on Luckyrent&rsquo;s official site and staff. Deposit terms are
          deliberately not stated anywhere in this demo because they are not published in the
          source data; the demo agent escalates such questions, as a production agent would.
          All other numbers (traffic volumes, conversion rates, seeded stock, sample bookings) are
          invented SAMPLE values used to illustrate mechanics.
        </p>

        <h2>4. Intellectual property</h2>
        <p>
          The Luckyrent name, brand, prices and review quotes remain the property of Luckyrent and
          the respective reviewers; they are referenced here nominatively, solely to demonstrate
          the agent for Luckyrent&rsquo;s own benefit, with sources credited. The demo source code
          was written by Saba Khintibidze and is provided to Luckyrent as a free gift, as-is.
        </p>

        <h2>5. Disclaimer and liability</h2>
        <p>
          This demo is provided &ldquo;as is&rdquo;, without warranty of any kind. To the maximum
          extent permitted by law, the builder is not liable for any decision made, or any loss or
          damage arising, from the use of this demonstration or the sample figures it displays.
          Cost estimates shown in the owner console FAQ are the builder&rsquo;s standard rate
          ranges for illustration, not a binding offer.
        </p>

        <h2>6. Contact</h2>
        <p>
          Questions about this demo:{" "}
          <a href="https://t.me/Saba_Khintibidze999" target="_blank" rel="noopener noreferrer">
            t.me/Saba_Khintibidze999
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/freelancersabakhintibidze-stack"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/freelancersabakhintibidze-stack
          </a>
          . Questions about rentals: contact Luckyrent Phuket directly via luckyrent-phuket.com.
        </p>
      </div>
    </div>
  );
}
