import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";
import PremiumCursor from "@/components/PremiumCursor";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { DEMO_DESCRIPTION, DEMO_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEMO_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEMO_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Saba Khintibidze", url: "https://github.com/freelancersabakhintibidze-stack" }],
  keywords: [
    "Luckyrent Phuket",
    "motorbike rental Phuket",
    "AI booking agent",
    "demo",
    "Saba Khintibidze",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEMO_TITLE,
    description: DEMO_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEMO_TITLE,
    description: DEMO_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05140A",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Saba Khintibidze · AI Automation",
  description:
    "Independent AI automation engineer. Builder of this demo (a free gift prepared for Luckyrent Phuket).",
  url: "https://github.com/freelancersabakhintibidze-stack",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://t.me/Saba_Khintibidze999",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: DEMO_TITLE,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web (any modern browser)",
  description: DEMO_DESCRIPTION,
  featureList: [
    "24/7 scripted booking agent demo in EN, RU, UA, TH",
    "Finished booking cards handed to the owner console",
    "Coverage-gap and revenue-leak analysis with visible formulas",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free independent demo gift. No account, no installation.",
  },
  author: {
    "@type": "Person",
    name: "Saba Khintibidze",
    url: "https://t.me/Saba_Khintibidze999",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        <PremiumCursor />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
        />
      </body>
    </html>
  );
}
