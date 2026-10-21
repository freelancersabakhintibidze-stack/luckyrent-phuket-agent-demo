import Link from "next/link";
import { BUILDER, SITE_URL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/">Landing</Link>
          <Link href="/owner">Owner console</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/provenance">Provenance</Link>
        </nav>
        <p className="footer-provenance">
          Provenance: all fleet models, tier prices, specs, zones, value propositions and the
          4.7/743 rating come from the public luckyrent-phuket.com, fetched 2026-10-20 (full table
          with URLs on <Link href="/provenance">/provenance</Link>). Everything else in this app is
          simulated and visibly labeled DEMO or SAMPLE, with the reason and the formula shown next
          to each figure. This is an independent demo, not Luckyrent&rsquo;s site; no data is sent to
          Luckyrent from this app.
        </p>
        <p className="footer-credit">
          Built by {BUILDER.name} · {BUILDER.role} ·{" "}
          <a href={BUILDER.telegram} target="_blank" rel="noopener noreferrer">
            {BUILDER.telegramHandle}
          </a>{" "}
          ·{" "}
          <a href={BUILDER.github} target="_blank" rel="noopener noreferrer">
            {BUILDER.githubHandle}
          </a>
          <br />
          <span className="dim">Demo URL: {SITE_URL}</span>
        </p>
      </div>
    </footer>
  );
}
