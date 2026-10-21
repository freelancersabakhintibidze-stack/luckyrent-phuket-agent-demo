/**
 * Owner console FAQ (3 items, per the brief) + FAQPage JSON-LD.
 */
const FAQ_ITEMS = [
  {
    q: "Is this live AI?",
    a: "No. In this demo the agent is a deterministic scripted engine: a state machine over a conversation JSON built exclusively from Luckyrent's published data. That is deliberate. It needs no API keys, costs nothing to run, makes no network calls, and it can never invent a price or a policy. The production agent would be LLM-backed, with this same UX and the same honesty rules: answer only from approved data, escalate anything unpublished (like deposit terms) to a human, and hand over only finished bookings.",
  },
  {
    q: "Where does the data come from?",
    a: "Every fleet model, tier price (7/14/21/30 days), load cap, speed, delivery zone, value proposition, the 4.7 rating from 743 Google reviews, the headline price and the staff hours come from the public luckyrent-phuket.com and their Telegram bio, fetched 2026-10-20. The full point-by-point table with source URLs is on /provenance. Everything else you see (KPIs, seeded stock, night-message volume, close rate, seeded conversations) is invented SAMPLE data for illustration and is labeled as such wherever it appears.",
  },
  {
    q: "What does it cost?",
    a: "This demo is a free gift. If Luckyrent wanted the production version, these are the builder's standard rates (from the project brief, in USD):",
    prices: [
      "Full booking-agent build like this one: 1,500-4,000 $ one-time + 200-500 $/month to operate",
      "Single-workflow automations: 500-2,500 $ one-time + 200-800 $/month",
      "Integration fixes: 300-800 $",
    ],
  },
];

export default function FaqBlock() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.prices ? `${item.a} ${item.prices.join("; ")}.` : item.a,
      },
    })),
  };

  return (
    <div>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div className="faq-item" key={item.q}>
            <h3>
              <span className="mono gold" style={{ fontSize: "0.8em", marginRight: 10 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.q}
            </h3>
            <p>{item.a}</p>
            {item.prices ? (
              <div className="price-line">
                {item.prices.map((p) => (
                  <span key={p} style={{ display: "block" }}>
                    {p}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
}
