"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTION_BY_PATH: Record<string, string> = {
  "/": "\u00a7 LANDING",
  "/owner": "\u00a7 OWNER CONSOLE",
  "/terms": "\u00a7 TERMS",
  "/privacy": "\u00a7 PRIVACY",
  "/provenance": "\u00a7 PROVENANCE",
};

/**
 * Honesty banner (slim strip at the very top of every page) + sticky
 * navigation bar with brand mark, page links and the current section label.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const section = SECTION_BY_PATH[pathname] ?? "\u00a7 DEMO";

  return (
    <>
      <div className="honesty-banner" role="note">
        <div className="container hb-inner">
          <span className="hb-dot" aria-hidden="true" />
          <p>
            <strong>Independent demo</strong> prepared for Luckyrent Phuket by Saba Khintibidze.{" "}
            <strong>Not the official Luckyrent site.</strong> Fleet data: public
            luckyrent-phuket.com, fetched 20 Oct 2026. Conversations and bookings below are
            simulated and labeled DEMO.
          </p>
        </div>
      </div>
      <header className="site-header">
        <div className="container running-head">
          <Link href="/" className="brand-link">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span className="brand-text">
              Luckyrent Phuket <span className="brand-tag">Agent Demo</span>
            </span>
          </Link>
          <nav className="head-nav" aria-label="Primary">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Agent</Link>
            <Link href="/owner" aria-current={pathname === "/owner" ? "page" : undefined}>Owner console</Link>
          </nav>
          <span className="rh-right">{section}</span>
        </div>
      </header>
    </>
  );
}
