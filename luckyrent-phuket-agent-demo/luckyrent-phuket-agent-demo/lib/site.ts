/** Site-wide constants for metadata. Zero env vars required: falls back to localhost. */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const SITE_NAME = "Luckyrent Phuket · 24/7 Booking Agent Demo";

export const BUILDER = {
  name: "Saba Khintibidze",
  role: "AI automation engineer",
  telegram: "https://t.me/Saba_Khintibidze999",
  telegramHandle: "t.me/Saba_Khintibidze999",
  github: "https://github.com/freelancersabakhintibidze-stack",
  githubHandle: "github.com/freelancersabakhintibidze-stack",
} as const;

export const DEMO_TITLE = "Luckyrent Phuket · 24/7 booking agent demo";
export const DEMO_DESCRIPTION =
  "Independent demo prepared for Luckyrent Phuket by Saba Khintibidze. Not the official Luckyrent site. A scripted 24/7 booking agent answers in EN, RU, UA and TH from real public fleet data and hands the owner only finished bookings. All conversations and bookings are simulated and labeled DEMO.";

export function ogImageUrl(title: string): string {
  return `/og?title=${encodeURIComponent(title)}`;
}
