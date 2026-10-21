import type { ReactNode } from "react";
import { getModel } from "@/data/fleet";
import { formatBaht } from "@/lib/format";
import { t, zoneName } from "@/lib/i18n";
import type { BookingData } from "@/lib/types";

/**
 * The FINISHED booking card. The same component renders in the landing chat
 * (Surface A) and in the owner inbox (Surface B), so what the manager sees is
 * exactly what the agent produced. Every calculated figure shows its formula.
 */
export default function BookingCard({
  booking,
  actions,
}: {
  booking: BookingData;
  actions?: ReactNode;
}) {
  const s = t(booking.lang);
  const model = getModel(booking.modelId);

  return (
    <div className="booking-card" data-testid="booking-card" lang={booking.lang === "ua" ? "uk" : booking.lang}>
      <div className="bc-head">
        <span className="bc-title">
          {s.card.finished}{" "}
          {booking.sample ? (
            <span className="tag tag-sample" title="simulated for demonstration">SAMPLE</span>
          ) : (
            <span className="tag tag-demo" title="simulated for demonstration">DEMO</span>
          )}
        </span>
        <span className="bc-ref" data-testid="card-ref">
          {s.card.ref} {booking.ref}
        </span>
      </div>
      <div className="bc-rows">
        <div className="bc-row">
          <span className="bc-k">{s.card.zone}</span>
          <span className="bc-v" data-testid="card-zone">{zoneName(booking.lang, booking.zoneId)}</span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.model}</span>
          <span className="bc-v" data-testid="card-model">{model?.name ?? booking.modelId}</span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.dates}</span>
          <span className="bc-v mono" data-testid="card-dates">
            {booking.start} &rarr; {booking.end}
          </span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.days}</span>
          <span className="bc-v mono">{booking.days} {s.booking.daysShort}</span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.total}</span>
          <span className="bc-v">
            <span className="bc-total tnum" data-testid="card-total">
              {formatBaht(booking.total, booking.lang)}
            </span>
            <span className="bc-formula" data-testid="card-formula">
              {s.card.formulaNote}: {booking.formula}
            </span>
          </span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.included}</span>
          <span className="bc-v">{s.card.includedValue}</span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.delivery}</span>
          <span className="bc-v">{s.card.deliveryValue}</span>
        </div>
        <div className="bc-row">
          <span className="bc-k">{s.card.openQuestions}</span>
          <span className="bc-v bc-openq">{s.card.depositQuestion}</span>
        </div>
      </div>
      <div className="bc-actions">
        {actions}
        <span className="bc-demo-reason">{s.card.demoReason}</span>
      </div>
    </div>
  );
}
