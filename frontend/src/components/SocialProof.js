import { SOCIAL_PROOF, realStats, realTestimonials } from "@/config/socialProof";

// Real screenshots of the tools, captured from the live UI (scripts/capture-tool-screens.js).
const SCREENS = [
  { src: "/screens/time-zone-converter.webp", href: "/time-zone-converter", title: "Time Zone Converter", alt: "Time Zone Converter showing live clocks for several cities with working-hours status" },
  { src: "/screens/meeting-planner.webp", href: "/meeting-planner", title: "Meeting Planner", alt: "Meeting Planner comparing working hours across cities and highlighting a shared window" },
  { src: "/screens/currency-converter.webp", href: "/currency-converter", title: "Currency Converter", alt: "Currency Converter converting US dollars to another currency at a live rate" },
  { src: "/screens/invoice-builder.webp", href: "/invoice", title: "Invoice Builder", alt: "Invoice Builder form with client details, line items and a currency reference line" },
];

export default function SocialProof() {
  const stats = realStats();
  const quotes = realTestimonials();

  return (
    <section className="social-proof" aria-labelledby="proof-title" data-testid="social-proof">
      <div className="proof-heading">
        <h2 id="proof-title">The tools, as they are.</h2>
        <p>No account, no trial, no catch. Here&rsquo;s what you get and what it looks like.</p>
      </div>

      <ul className="proof-facts">
        {SOCIAL_PROOF.productFacts.map((f) => (
          <li key={f.label}><strong>{f.value}</strong><span>{f.label}</span></li>
        ))}
      </ul>

      {/* Real usage stats and testimonials appear here once added to src/config/socialProof.js. */}
      {stats.length > 0 && (
        <ul className="proof-stats" aria-label="Usage">
          {stats.map((s) => <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>)}
        </ul>
      )}

      {quotes.length > 0 && (
        <div className="proof-quotes">
          {quotes.map((t) => (
            <figure key={t.name}><blockquote>&ldquo;{t.quote}&rdquo;</blockquote><figcaption>{t.name}<span>{t.role}</span></figcaption></figure>
          ))}
        </div>
      )}

      <div className="proof-screens" aria-label="Screenshots of the tools">
        {SCREENS.map((s) => (
          <a key={s.href} href={s.href} className="proof-screen">
            <img src={s.src} alt={s.alt} width="640" height="400" loading="lazy" decoding="async" />
            <span>{s.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
