"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BookingCard from "@/components/BookingCard";
import { FLEET, LANGS, LANG_META, ZONES, type Lang } from "@/data/fleet";
import {
  DEFAULT_PRICE_DAYS,
  DEFAULT_PRICE_MODEL,
  applyDates,
  applyModel,
  applyZone,
  bookingStart,
  buildBooking,
  buildDeliveryAnswer,
  buildPriceAnswer,
  buildPriceQuestion,
  matchIntent,
  parseDurationDays,
  parseModel,
  type BookingState,
} from "@/lib/agent";
import { onPrefill } from "@/lib/bus";
import { addDays, formatBaht, phuketTomorrow } from "@/lib/format";
import { fill, t, zoneName } from "@/lib/i18n";
import { handToManager, reserveRef } from "@/lib/store";
import type { BookingData } from "@/lib/types";

type Msg =
  | { id: number; role: "agent"; kind: "text"; text: string; caption?: string }
  | { id: number; role: "visitor"; kind: "text"; text: string }
  | { id: number; role: "agent"; kind: "card"; booking: BookingData; handed: boolean; caption?: string };

/** The simulated "instant answer" delay; the caption measures real elapsed time. */
const TYPING_DELAY_MS = 400;

function greetingMsg(lang: Lang, id: number): Msg {
  return { id, role: "agent", kind: "text", text: t(lang).greeting };
}

export default function ChatWidget() {
  const [lang, setLang] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<Msg[]>(() => [greetingMsg("en", 1)]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [booking, setBooking] = useState<BookingState | null>(null);
  const [showChips, setShowChips] = useState(true);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const idRef = useRef(2);
  const logRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

  /** Push an agent reply after the simulated delay, with the measured-time caption. */
  const respond = useCallback((build: (lang: Lang) => string, forLang: Lang) => {
    const t0 = performance.now();
    setTyping(true);
    window.setTimeout(() => {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: idRef.current++,
          role: "agent",
          kind: "text",
          text: build(forLang),
          caption: fill(t(forLang).caption, { t: elapsed }),
        },
      ]);
    }, TYPING_DELAY_MS);
  }, []);

  const startBooking = useCallback(
    (zoneId?: string) => {
      const min = phuketTomorrow();
      setDateStart(min);
      setDateEnd(addDays(min, 7));
      setBooking(bookingStart(zoneId));
      setShowChips(false);
      respond(
        (l) =>
          zoneId
            ? `${t(l).booking.intro} ${zoneName(l, zoneId)}: ${t(l).booking.askDates}`
            : `${t(l).booking.intro} ${t(l).booking.askZone}`,
        langRef.current,
      );
    },
    [respond],
  );

  const handleSend = useCallback(
    (raw: string) => {
      if (typing) return;
      const text = raw.trim();
      if (!text) return;
      setInput("");
      setMsgs((m) => [...m, { id: idRef.current++, role: "visitor", kind: "text", text }]);
      const currentLang = langRef.current;
      const intent = matchIntent(text);
      if (!intent) {
        setShowChips(true);
        respond((l) => t(l).unmatched, currentLang);
        return;
      }
      setShowChips(false);
      if (intent === "price") {
        const modelId = parseModel(text) ?? DEFAULT_PRICE_MODEL;
        const days = parseDurationDays(text) ?? DEFAULT_PRICE_DAYS;
        respond((l) => buildPriceAnswer(modelId, days, l), currentLang);
        return;
      }
      if (intent === "delivery") {
        respond((l) => buildDeliveryAnswer(l), currentLang);
        return;
      }
      startBooking();
    },
    [typing, respond, startBooking],
  );

  // Keep the latest actions reachable from the (once-registered) bus listener.
  const actionsRef = useRef({ handleSend, startBooking });
  actionsRef.current = { handleSend, startBooking };

  useEffect(
    () =>
      onPrefill((detail) => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document
          .getElementById("agent")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        if (detail.kind === "ask-price") {
          actionsRef.current.handleSend(
            buildPriceQuestion(detail.modelId, 7, langRef.current),
          );
        } else {
          actionsRef.current.startBooking(detail.zoneId);
        }
      }),
    [],
  );

  // Auto-scroll the log.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, booking]);

  const switchLang = (next: Lang) => {
    setLang(next);
    idRef.current = 2;
    setMsgs([greetingMsg(next, 1)]);
    setBooking(null);
    setShowChips(true);
    setInput("");
    setTyping(false);
  };

  const pickZone = (zoneId: string) => {
    setBooking(applyZone(zoneId));
    respond((l) => t(l).booking.askDates, lang);
  };

  const confirmDates = () => {
    if (!booking) return;
    const res = applyDates(booking, dateStart, dateEnd, phuketTomorrow());
    if (!res.ok) {
      respond((l) => t(l).booking.datesInvalid, lang);
      return;
    }
    setBooking(res.state);
    respond((l) => t(l).booking.askModel, lang);
  };

  const pickModel = (modelId: string) => {
    if (!booking) return;
    const res = applyModel(booking, modelId, lang);
    if (res.kind === "conflict") {
      respond(() => res.message, lang);
      return;
    }
    const data = buildBooking(res.state, reserveRef(), lang);
    if (!data) return;
    setBooking({ ...res.state, step: "done" });
    const t0 = performance.now();
    setTyping(true);
    window.setTimeout(() => {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: idRef.current++,
          role: "agent",
          kind: "card",
          booking: data,
          handed: false,
          caption: fill(t(lang).caption, { t: elapsed }),
        },
      ]);
    }, TYPING_DELAY_MS);
  };

  const onHand = (msgId: number, data: BookingData) => {
    handToManager(data);
    setMsgs((m) =>
      m.map((x) => (x.id === msgId && x.kind === "card" ? { ...x, handed: true } : x)),
    );
    setBooking(null);
    setShowChips(true);
    respond((l) => t(l).booking.handedOk, lang);
  };

  const restartFlow = () => {
    setBooking(null);
    setShowChips(true);
  };

  const s = t(lang);
  const stepActive = booking !== null && booking.step !== "done";
  const chipsVisible = showChips && !stepActive;
  const minStart = phuketTomorrow();

  const stepIndex = booking ? { zone: 1, dates: 2, model: 3, done: 3 }[booking.step] : 0;

  return (
    <div className="panel chat-shell" data-testid="chat-widget">
      <div className="chat-head">
        <span className="title">
          <span className="pulse-dot" aria-hidden="true" />
          agent online · 24/7 <span className="tag tag-demo" title="simulated for demonstration">DEMO</span>
        </span>
        <div className="lang-switch" role="group" aria-label="Conversation language">
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              data-testid={`lang-${code}`}
              aria-pressed={lang === code}
              onClick={() => switchLang(code)}
              title={LANG_META[code].name}
            >
              {LANG_META[code].label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="chat-log"
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Simulated agent conversation"
        lang={LANG_META[lang].htmlLang}
        data-testid="chat-log"
      >
        {msgs.map((msg) => {
          if (msg.kind === "card") {
            return (
              <div className="msg msg-agent" key={msg.id}>
                <BookingCard
                  booking={msg.booking}
                  actions={
                    msg.handed ? (
                      <>
                        <span className="bc-demo-reason gold">{s.card.handed}</span>
                        <Link href="/owner" className="btn btn-small" data-testid="open-owner">
                          {s.card.openInbox}
                        </Link>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-small btn-solid"
                        data-testid="hand-btn"
                        onClick={() => onHand(msg.id, msg.booking)}
                      >
                        {s.card.hand}
                      </button>
                    )
                  }
                />
                {msg.caption ? <span className="msg-caption">{msg.caption}</span> : null}
              </div>
            );
          }
          return (
            <div className={`msg msg-${msg.role}`} key={msg.id}>
              <div className="bubble">{msg.text}</div>
              {"caption" in msg && msg.caption ? (
                <span className="msg-caption" data-testid="answer-caption">
                  {msg.caption}
                </span>
              ) : null}
            </div>
          );
        })}
        {typing ? (
          <div className="typing" aria-hidden="true">
            {s.typing}
            <span className="dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        ) : null}
      </div>

      {stepActive && booking ? (
        <div className="step-panel" data-testid="step-panel">
          <span className="step-title">
            slot {stepIndex}/3 · {booking.step}
          </span>
          {booking.step === "zone" ? (
            <div className="chip-row" role="group" aria-label="Delivery zone">
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className="chip"
                  data-testid={`zone-${z.id}`}
                  onClick={() => pickZone(z.id)}
                >
                  {zoneName(lang, z.id)}
                </button>
              ))}
            </div>
          ) : null}
          {booking.step === "dates" ? (
            <div className="date-form">
              <div className="date-field">
                <label htmlFor="date-start">{s.booking.dateStart}</label>
                <input
                  id="date-start"
                  type="date"
                  data-testid="date-start"
                  value={dateStart}
                  min={minStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
              </div>
              <div className="date-field">
                <label htmlFor="date-end">{s.booking.dateEnd}</label>
                <input
                  id="date-end"
                  type="date"
                  data-testid="date-end"
                  value={dateEnd}
                  min={dateStart || minStart}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-small"
                data-testid="dates-confirm"
                onClick={confirmDates}
              >
                {s.booking.confirmDates}
              </button>
              <span className="date-hint">
                {s.booking.dateHint} · availability: SAMPLE stock
              </span>
            </div>
          ) : null}
          {booking.step === "model" ? (
            <div className="chip-row" role="group" aria-label="Model">
              {FLEET.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="chip"
                  data-testid={`model-${m.id}`}
                  onClick={() => pickModel(m.id)}
                >
                  {m.name}
                  <span className="chip-sub">7 d {formatBaht(m.tiers[7], lang)}</span>
                </button>
              ))}
            </div>
          ) : null}
          <div>
            <button type="button" className="chip btn-small" onClick={restartFlow}>
              {s.restart}
            </button>
          </div>
        </div>
      ) : null}

      {booking?.step === "done" && !stepActive ? (
        <div className="step-panel">
          <button type="button" className="chip" onClick={restartFlow} data-testid="restart-chip">
            {s.restart}
          </button>
        </div>
      ) : null}

      {chipsVisible ? (
        <div className="step-panel">
          <span className="step-title">scripted intents</span>
          <div className="chip-row">
            <button
              type="button"
              className="chip"
              data-testid="chip-price"
              onClick={() => handleSend(s.chips.price)}
            >
              {s.chips.price}
            </button>
            <button
              type="button"
              className="chip"
              data-testid="chip-delivery"
              onClick={() => handleSend(s.chips.delivery)}
            >
              {s.chips.delivery}
            </button>
            <button
              type="button"
              className="chip"
              data-testid="chip-booking"
              onClick={() => handleSend(s.chips.booking)}
            >
              {s.chips.booking}
            </button>
          </div>
        </div>
      ) : null}

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
      >
        <label className="visually-hidden" htmlFor="chat-input">
          Message the demo agent
        </label>
        <input
          id="chat-input"
          type="text"
          data-testid="chat-input"
          value={input}
          placeholder={s.composerPlaceholder}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn" data-testid="chat-send" disabled={typing}>
          {s.send}
        </button>
      </form>
      <div className="chat-footnote">
        Deterministic scripted engine · answers only from public luckyrent-phuket.com data (fetched
        2026-10-20) · no LLM and no network calls in this demo · everything above is simulated for
        demonstration
      </div>
    </div>
  );
}
