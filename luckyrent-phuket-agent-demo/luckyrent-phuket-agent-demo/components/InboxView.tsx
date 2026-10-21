"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookingCard from "@/components/BookingCard";
import { LANG_META } from "@/data/fleet";
import { INBOX_STATUS_LABELS, SEED_INBOX } from "@/data/seed";
import { formatBaht } from "@/lib/format";
import { fill, t, zoneName } from "@/lib/i18n";
import { getModel } from "@/data/fleet";
import { useDemoStore } from "@/lib/store";
import type { InboxItem } from "@/lib/types";

/**
 * Owner inbox: seeded SAMPLE conversations + live DEMO handovers made in the
 * landing chat during this browser session. Finished bookings expand into the
 * exact same BookingCard component the visitor saw.
 */
export default function InboxView() {
  const store = useDemoStore();
  const [mounted, setMounted] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const liveItems: InboxItem[] = [...store.handed]
    .reverse()
    .map((h) => {
      const b = h.booking;
      const model = getModel(b.modelId);
      return {
        id: `live-${b.ref}`,
        lang: b.lang,
        sample: false,
        customer: fill(t(b.lang).booking.inboxSummary, {
          model: model?.name ?? b.modelId,
          zone: zoneName(b.lang, b.zoneId),
          start: b.start,
          end: b.end,
          days: b.days,
          total: formatBaht(b.total, b.lang),
        }),
        agentReply: t(b.lang).booking.inboxReply,
        status: "finished-booking" as const,
        booking: b,
        handedAt: h.handedAt,
      };
    });

  const items: InboxItem[] = [...liveItems, ...SEED_INBOX];

  if (!mounted) {
    return (
      <div aria-busy="true" aria-label="Loading inbox (demo data)">
        <div className="skeleton skeleton-line" style={{ width: "40%" }} />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" style={{ height: 90, marginTop: 12 }} />
      </div>
    );
  }

  return (
    <div className="inbox" data-testid="inbox">
      {liveItems.length === 0 ? (
        <p className="src-note" style={{ marginBottom: 14 }}>
          No live handovers in this browser yet. Complete a booking in the landing chat and press
          &ldquo;Hand to manager&rdquo;: it appears here with an audit row.{" "}
          <Link href="/#agent">Open the chat</Link>
        </p>
      ) : (
        <p className="src-note" style={{ marginBottom: 14 }}>
          {liveItems.length} live DEMO handover{liveItems.length === 1 ? "" : "s"} from this browser
          session (stored in your browser only), shown above the seeded SAMPLE conversations.
        </p>
      )}
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div className="inbox-item" key={item.id} data-testid={`inbox-${item.id}`}>
            <div className="inbox-meta">
              <span>{LANG_META[item.lang].label}</span>
              {item.sample ? (
                <span className="tag tag-sample" title="simulated for demonstration">SAMPLE</span>
              ) : (
                <span className="tag tag-demo" title="simulated for demonstration">DEMO</span>
              )}
              <span
                className={`status-chip ${
                  item.status === "auto-answered"
                    ? "status-auto"
                    : item.status === "needs-human"
                      ? "status-human"
                      : "status-finished"
                }`}
              >
                {INBOX_STATUS_LABELS[item.status]}
              </span>
              {item.handedAt ? <span>handed {item.handedAt} (Phuket)</span> : null}
            </div>
            <p className="inbox-customer" lang={LANG_META[item.lang].htmlLang}>
              <span className="who">customer</span>
              {item.customer}
            </p>
            <p className="inbox-agent" lang={LANG_META[item.lang].htmlLang}>
              <span className="who">agent {item.status === "needs-human" ? "draft" : "reply"}</span>
              {item.agentReply}
            </p>
            {item.status === "finished-booking" && item.booking ? (
              <>
                <button
                  type="button"
                  className="btn btn-small inbox-toggle"
                  aria-expanded={open}
                  data-testid={`open-card-${item.booking.ref}`}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  {open ? "Hide booking card" : "Open booking card"}
                </button>
                {open ? (
                  <div className="inbox-card-wrap">
                    <BookingCard booking={item.booking} />
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
