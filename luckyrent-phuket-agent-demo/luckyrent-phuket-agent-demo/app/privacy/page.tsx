import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, ogImageUrl } from "@/lib/site";

const TITLE = "Privacy policy (demo)";
const DESCRIPTION =
  "Privacy policy for the independent Luckyrent Phuket booking agent demo: no accounts, no cookies, no analytics, no third-party runtime requests. Demo bookings stay in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${TITLE} · Luckyrent Phuket agent demo`,
    description: DESCRIPTION,
    url: `${SITE_URL}/privacy`,
    images: [{ url: ogImageUrl("Privacy policy · Luckyrent agent demo"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [ogImageUrl("Privacy policy · Luckyrent agent demo")] },
};

export default function PrivacyPage() {
  return (
    <div className="container section">
      <div className="prose">
        <p className="updated">Last updated: 2026-10-20</p>
        <h1>{TITLE}</h1>

        <h2>1. What this app collects: nothing</h2>
        <p>
          This independent demo has <strong>no accounts, no cookies, no analytics, no advertising
          and no tracking scripts</strong>. It makes <strong>no third-party requests at runtime</strong>:
          fonts are self-hosted, the &ldquo;AI agent&rdquo; is a deterministic script running in
          your browser, and no data leaves your device through this app.
        </p>

        <h2>2. What the chat asks for (and what it does not)</h2>
        <p>
          The demo booking flow asks only for a delivery zone, two dates and a bike model. It never
          asks for your name, phone number, passport, payment data or location, and you should not
          type such data into the demo chat. Conversations exist only in the page&rsquo;s memory
          and disappear on reload.
        </p>

        <h2>3. Browser local storage</h2>
        <p>
          When you press &ldquo;Hand to manager&rdquo;, the simulated booking card and one audit
          row are written to your own browser&rsquo;s <code>localStorage</code> so the owner
          console on <Link href="/owner">/owner</Link> can show them. This data stays on your
          device, is not transmitted anywhere, and can be deleted at any time with the{" "}
          <strong>&ldquo;Reset demo data&rdquo;</strong> button in the owner console audit section,
          or by clearing your browser storage.
        </p>

        <h2>4. Hosting</h2>
        <p>
          When deployed (for example on Vercel), the hosting provider may keep standard infrastructure
          logs (such as IP addresses in server logs) under its own privacy policy. This demo adds no
          tracking of its own and configures no analytics.
        </p>

        <h2>5. Data shown about Luckyrent</h2>
        <p>
          Business data displayed in the demo (fleet, prices, zones, hours, rating, two public
          review quotes) was collected from the public luckyrent-phuket.com on 2026-10-20 and is
          credited on <Link href="/provenance">/provenance</Link>. No non-public Luckyrent data and
          no real customer data is used anywhere in this app.
        </p>

        <h2>6. Contact</h2>
        <p>
          Privacy questions about this demo:{" "}
          <a href="https://t.me/Saba_Khintibidze999" target="_blank" rel="noopener noreferrer">
            t.me/Saba_Khintibidze999
          </a>
          . This policy does not describe Luckyrent&rsquo;s own services; see their official site
          for that.
        </p>
      </div>
    </div>
  );
}
