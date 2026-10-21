import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * Dynamic OpenGraph / Twitter card image (1200x630).
 * Uses next/og (built into Next.js, zero extra dependencies, zero env vars).
 * Text is kept Latin-only because the bundled default font covers Latin.
 */
export const runtime = "nodejs";

const GOLD = "#C9A227";
const GOLD_LIGHT = "#D4AF37";
const IVORY = "#F5F5DC";
const DEEP = "#05140A";
const MOSS = "#8FBC8F";

export async function GET(request: NextRequest) {
  const title = (request.nextUrl.searchParams.get("title") ??
    "Luckyrent Phuket · 24/7 booking agent demo").slice(0, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: DEEP,
          padding: 64,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1px solid ${GOLD}55`,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: GOLD,
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Independent demo · not the official Luckyrent site
          </div>
          <div
            style={{
              display: "flex",
              color: IVORY,
              fontSize: title.length > 60 ? 58 : 72,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", width: 160, height: 1, background: GOLD }} />
          <div style={{ display: "flex", color: MOSS, fontSize: 26 }}>
            Scripted agent answers in EN / RU / UA / TH from real public fleet data · finished
            booking cards handed to the owner · conversations labeled DEMO
          </div>
          <div style={{ display: "flex", color: GOLD_LIGHT, fontSize: 22, letterSpacing: 2 }}>
            Built by Saba Khintibidze · AI automation engineer · t.me/Saba_Khintibidze999
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
