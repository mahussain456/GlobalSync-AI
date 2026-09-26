import { ABBREVIATION_OFFSETS, convertFixedTime } from "@/lib/timeCalculations";
import { useState, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Clock, ArrowRight, AlertCircle, CheckCircle2, Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { getZonePair, getRelatedPairs, ZONE_META } from "@/data/zonePairs";
import { getPairContext } from "@/data/pairContext";
import {
  getOffsetDiff,
  formatOffsetDescription,
  generate24hTable,
  computeBusinessOverlap,
  formatUTCOffset,
} from "@/lib/timezoneUtils";

// ─── Inline time converter widget ────────────────────────────────────────────
function ZoneWidget({ zonePair }) {
  const [inputTime, setInputTime] = useState("09:00");
  const [inputDate, setInputDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const converted = useMemo(() => {
    try {
      return convertFixedTime(inputDate, inputTime, zonePair.from, zonePair.to);
    } catch (_) {
      return null;
    }
  }, [inputTime, inputDate, zonePair.from, zonePair.to]);

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 mb-8">
      <h2 className="font-heading text-lg font-semibold text-ink mb-4">
        Convert a fixed abbreviation time
      </h2>
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="block text-xs text-quiet mb-1">Date</label>
          <input
            aria-label="Conversion date" type="date"
            value={inputDate}
            onChange={e => setInputDate(e.target.value)}
            className="bg-surface border border-line rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-line"
          />
        </div>
        <div>
          <label className="block text-xs text-quiet mb-1">Time in {zonePair.from}</label>
          <input
            aria-label="Time to convert" type="time"
            value={inputTime}
            onChange={e => setInputTime(e.target.value)}
            className="bg-surface border border-line rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-line"
          />
        </div>
      </div>
      {converted && (
        <div className="flex items-center gap-3 p-4 bg-gem-gold/10 border border-line rounded-xl">
          <div className="text-quiet text-sm">{inputTime} {zonePair.from}</div>
          <ArrowRight className="w-4 h-4 text-pine" />
          <div>
            <div className="text-ink font-semibold">{converted.toTime} {zonePair.to}</div>
            <div className="text-quiet text-xs">{converted.toDateStr}
              {converted.dayDiff !== 0 && (
                <span className="ml-1 text-pine">
                  ({converted.dayDiff > 0 ? "+" : ""}{converted.dayDiff} day)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible FAQ item ─────────────────────────────────────────────────────
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-4 flex items-start justify-between gap-4 text-ink hover:text-pine transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-sm leading-snug">{question}</span>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-pine" />
          : <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5 text-quiet" />}
      </button>
      {open && (
        <div className="pb-4 text-quiet text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ZonePairPage() {
  const { pair } = useParams();
  const zonePair = getZonePair(pair);

  if (!zonePair) return <Navigate to="/convert" replace />;

  const { from, to, fromIANA, toIANA, fromAbbrNote } = zonePair;
  const fromMeta = ZONE_META[fromIANA] ?? {};
  const toMeta   = ZONE_META[toIANA]   ?? {};
  const context  = getPairContext(pair);

  // Core computations (static — react-snap captures these as HTML)
  const diffMinutes   = ABBREVIATION_OFFSETS[to] - ABBREVIATION_OFFSETS[from];
  const offsetSentence = formatOffsetDescription(from, to, diffMinutes);
  const table24h       = Array.from({length: 24}, (_, hour) => { const minutes = ((hour * 60 + diffMinutes) % 1440 + 1440) % 1440; return {fromTime: `${String(hour).padStart(2,"0")}:00`, toTime: `${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`}; });
  const overlap        = computeBusinessOverlap(fromIANA, toIANA, new Date("2026-01-12T12:00:00Z"), ABBREVIATION_OFFSETS[from], ABBREVIATION_OFFSETS[to]);
  const relatedPairs   = getRelatedPairs(pair, 6);

  const fromOffsetStr = formatUTCOffset(ABBREVIATION_OFFSETS[from]);
  const toOffsetStr   = formatUTCOffset(ABBREVIATION_OFFSETS[to]);

  // SEO copy
  const absDiffHours = Math.floor(Math.abs(diffMinutes) / 60);
  const absDiffMins  = Math.abs(diffMinutes) % 60;
  const diffDisplay  = absDiffMins > 0
    ? `${absDiffHours}h ${absDiffMins}m`
    : `${absDiffHours} hour${absDiffHours !== 1 ? "s" : ""}`;

  const seoTitle = `${from} to ${to} Converter — Current Time Difference`;
  const seoDesc  = `Convert ${from} to ${to} instantly. ${offsetSentence} View 24-hour schedule alignment, business hour overlap, and seasonal DST transition rules.`;

  // JSON-LD schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Time Zone Converters", "item": "https://www.globalsync-ai.com/convert" },
      { "@type": "ListItem", "position": 3, "name": `${from} to ${to}`, "item": `https://www.globalsync-ai.com/convert/${pair}` },
    ],
  };

  const faqItems = buildFAQ({ from, to, fromMeta, toMeta, diffMinutes, overlap, fromAbbrNote });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${from} to ${to} Time Zone Converter`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "isAccessibleForFree": true,
    "publisher": { "@id": "https://www.globalsync-ai.com/#org" },
    "url": `https://www.globalsync-ai.com/convert/${pair}`,
  };

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://www.globalsync-ai.com/convert/${pair}`}
        schema={[breadcrumbSchema, faqSchema, toolSchema]}
      />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex flex-wrap items-center gap-1.5">
          <Link to="/" className="hover:text-quiet">Home</Link>
          <span>/</span>
          <Link to="/convert" className="hover:text-quiet">Time Zone Converters</Link>
          <span>/</span>
          <span className="text-quiet">{from} to {to}</span>
        </nav>

        {/* H1 */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-4">
          {from} to {to} Time Zone Converter
        </h1>

        {/* AEO above-fold answer block — present in raw HTML, cited by LLMs */}
        <div
          className="bg-gem-gold/10 border border-line rounded-2xl px-6 py-5 mb-8"
          data-schema-type="answer"
        >
          <p className="text-ink font-semibold text-lg leading-snug mb-2">
            {offsetSentence}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-quiet mt-3">
            <span>
              <span className="text-pine font-medium">{from}</span>{" "}
              ({fromMeta.fullName ?? from}, {fromOffsetStr} standard)
            </span>
            <span className="text-pine">→</span>
            <span>
              <span className="text-pine font-medium">{to}</span>{" "}
              ({toMeta.fullName ?? to}, {toOffsetStr} standard)
            </span>
          </div>
          {fromAbbrNote && (
            <p className="text-xs text-quiet mt-2 italic">{fromAbbrNote}</p>
          )}
        </div>

        <AdBanner slot="top" className="mb-8" />

        {/* Interactive converter widget */}
        <ZoneWidget zonePair={zonePair} />

        {/* 24-hour conversion table */}
        <section className="mb-10" aria-labelledby="table-heading">
          <h2 id="table-heading" className="font-heading text-xl font-bold text-ink mb-4">
            {from} to {to} — Full 24-Hour Conversion Table
          </h2>
          <p className="text-quiet text-sm mb-4">
            The table below shows what time it is in {toMeta.fullName ?? to} for every hour of the day in {fromMeta.fullName ?? from},
            using the fixed UTC offsets named by these abbreviations. A city may use a different abbreviation during daylight saving time.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-quiet">
                  <th className="text-left px-4 py-3 font-medium">
                    Time in {from} ({fromOffsetStr})
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    Time in {to} ({toOffsetStr})
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                    Context
                  </th>
                </tr>
              </thead>
              <tbody>
                {table24h.map(({ fromTime, toTime }, i) => {
                  const hour = i;
                  const isBizFrom = hour >= 9 && hour < 17;
                  const toHour    = parseInt(toTime.split(":")[0], 10);
                  const isBizTo   = toHour >= 9 && toHour < 17;
                  const isOverlap = isBizFrom && isBizTo;
                  return (
                    <tr
                      key={fromTime}
                      className={`border-t border-line ${isOverlap ? "bg-emerald-900/10" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-mono text-ink">{fromTime}</td>
                      <td className={`px-4 py-2.5 font-mono font-semibold ${isOverlap ? "text-emerald-800" : "text-ink"}`}>
                        {toTime}
                        {isOverlap && <span className="ml-2 text-xs text-emerald-500 font-sans">overlap</span>}
                      </td>
                      <td className="px-4 py-2.5 text-quiet text-xs hidden sm:table-cell">
                        {hour < 6 ? "🌙 Night" : hour < 9 ? "🌅 Early morning" : hour < 12 ? "🌤 Morning" : hour < 14 ? "☀️ Midday" : hour < 17 ? "🌤 Afternoon" : hour < 20 ? "🌆 Evening" : "🌙 Night"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-quiet mt-2 italic">
            Green rows indicate hours where both zones fall within 09:00–17:00 business hours. Abbreviations use their fixed UTC offsets. For a city that observes daylight saving, use the date-aware meeting planner.
          </p>
        </section>

        {/* Business hours overlap */}
        <section className="mb-10 bg-surface border border-line rounded-2xl p-6" aria-labelledby="overlap-heading">
          <h2 id="overlap-heading" className="font-heading text-xl font-bold text-ink mb-3">
            Best Meeting Times: {from} and {to}
          </h2>
          {overlap.hasOverlap ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                <p className="text-ink text-sm leading-relaxed">
                  {overlap.recommendation}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-xl p-4 text-center">
                  <div className="text-xs text-quiet mb-1">{from} window</div>
                  <div className="font-mono text-ink font-semibold">
                    {overlap.fromWindowStart} – {overlap.fromWindowEnd}
                  </div>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <div className="text-xs text-quiet mb-1">{to} window</div>
                  <div className="font-mono text-ink font-semibold">
                    {overlap.toWindowStart} – {overlap.toWindowEnd}
                  </div>
                </div>
              </div>
              <p className="text-xs text-quiet mt-4">
                Shared business-hours overlap: <strong className="text-pine">{overlap.durationStr}</strong>.
                Use our{" "}
                <Link to="/meeting-planner" className="text-pine hover:underline">
                  Meeting Planner
                </Link>{" "}
                to find specific slots and share with your team.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
                <p className="text-ink text-sm leading-relaxed">
                  Standard 09:00–17:00 business hours do not overlap between {fromMeta.fullName ?? from} and {toMeta.fullName ?? to}.
                </p>
              </div>
              <p className="text-quiet text-sm leading-relaxed">
                {overlap.recommendation}
              </p>
              <p className="text-xs text-quiet mt-4">
                For zero-overlap corridors, we recommend the{" "}
                <Link to="/meeting-planner" className="text-pine hover:underline">
                  Meeting Planner's
                </Link>{" "}
                rotation-fairness feature to distribute meeting burden equitably.
              </p>
            </>
          )}
        </section>

        {/* Hand-written corridor context (stub until human writes it) */}
        {context && (
          <section className="mb-10 bg-surface border border-line rounded-2xl p-6" aria-labelledby="corridor-heading">
            <h2 id="corridor-heading" className="font-heading text-xl font-bold text-ink mb-3">
              Working Across {from} and {to}
            </h2>
            <p className="text-quiet leading-relaxed">{context.context}</p>
            {context.corridor && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-gem-gold/10 border border-line rounded-full px-3 py-1 text-xs text-pine">
                {context.corridor}
              </div>
            )}
          </section>
        )}

        {/* DST section */}
        <section className="mb-10" aria-labelledby="dst-heading">
          <h2 id="dst-heading" className="font-heading text-xl font-bold text-ink mb-4">
            Daylight Saving Time: {from} and {to}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[{ abbr: from, meta: fromMeta }, { abbr: to, meta: toMeta }].map(({ abbr, meta }) => (
              <div key={abbr} className="bg-surface border border-line rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  {meta.observesDST
                    ? <Sun className="w-4 h-4 text-amber-800" />
                    : <Clock className="w-4 h-4 text-quiet" />}
                  <span className="font-semibold text-ink text-sm">{abbr} — {meta.fullName ?? abbr}</span>
                </div>
                {meta.observesDST ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block bg-amber-400/10 text-amber-800 text-xs rounded-full px-2 py-0.5">Observes DST</span>
                    </div>
                    <div className="text-quiet text-sm space-y-1 mt-2">
                      <div>Standard: <span className="text-ink font-mono">{formatUTCOffset((meta.stdOffsetHours ?? 0) * 60)}</span></div>
                      <div>DST ({meta.dstAbbr}): <span className="text-ink font-mono">{formatUTCOffset((meta.dstOffsetHours ?? 0) * 60)}</span></div>
                      {meta.dstStartDate && (
                        <div className="text-xs mt-2 text-quiet">
                          2026: clocks forward <strong className="text-ink">{meta.dstStartDate}</strong> · back <strong className="text-ink">{meta.dstEndDate}</strong>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-quiet mt-3 leading-relaxed">{meta.dstNote}</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block bg-gem-sage/10 text-quiet text-xs rounded-full px-2 py-0.5">No DST — fixed offset</span>
                    </div>
                    <div className="text-quiet text-sm mt-2">
                      Year-round: <span className="text-ink font-mono">{formatUTCOffset((meta.stdOffsetHours ?? 0) * 60)}</span>
                    </div>
                    <p className="text-xs text-quiet mt-3 leading-relaxed">{meta.dstNote}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          {(fromMeta.observesDST || toMeta.observesDST) && (
            <div className="mt-4 bg-amber-900/10 border border-amber-700/20 rounded-xl p-4 text-xs text-quiet">
              <strong className="text-amber-800">DST effect on this pair:</strong>{" "}
              {fromMeta.observesDST && toMeta.observesDST
                ? `Both zones observe DST, but their transition dates may not align. Between ${fromMeta.dstStartDate ?? "the US spring transition"} and ${toMeta.dstStartDate ?? "the EU spring transition"} (or vice versa in autumn), the gap between ${from} and ${to} will be 1 hour different from the standard offset shown above.`
                : fromMeta.observesDST
                  ? `${from} observes DST; ${to} does not. During ${from}'s DST period (${fromMeta.dstStartDate} – ${fromMeta.dstEndDate}), the gap between the two zones narrows by 1 hour.`
                  : `${to} observes DST; ${from} does not. During ${to}'s DST period (${toMeta.dstStartDate} – ${toMeta.dstEndDate}), the gap between the two zones shifts by 1 hour.`}
            </div>
          )}
        </section>

        <AdBanner slot="mid" className="mb-8" />

        {/* FAQ */}
        <section className="mb-10 bg-surface border border-line rounded-2xl p-6" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-heading text-xl font-bold text-ink mb-4">
            Frequently Asked Questions
          </h2>
          <div>
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Internal links — related pairs */}
        {relatedPairs.length > 0 && (
          <section className="mb-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-heading text-lg font-semibold text-ink mb-4">
              Related Time Zone Converters
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedPairs.map(p => (
                <Link
                  key={p.slug}
                  to={`/convert/${p.slug}`}
                  className="flex items-center gap-2 bg-surface hover:bg-surface border border-line hover:border-line rounded-xl px-4 py-3 transition-all text-sm text-ink hover:text-pine"
                >
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  {p.from} to {p.to}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Hub links */}
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/convert" className="text-pine hover:underline">← All time zone converters</Link>
          <span className="text-quiet">·</span>
          <Link to="/time-zone-converter" className="text-pine hover:underline">Time Zone Converter tool</Link>
          <span className="text-quiet">·</span>
          <Link to="/meeting-planner" className="text-pine hover:underline">Meeting Planner</Link>
        </div>

      </article>

      <SiteFooter />
    </div>
  );
}

// ─── FAQ builder — pair-specific questions from real data ─────────────────────
function buildFAQ({ from, to, fromMeta, toMeta, diffMinutes, overlap, fromAbbrNote }) {
  const abs = Math.abs(diffMinutes);
  const h   = Math.floor(abs / 60);
  const m   = abs % 60;
  const diffStr = m > 0 ? `${h} hours and ${m} minutes` : `${h} hour${h !== 1 ? "s" : ""}`;
  const dir = diffMinutes > 0 ? "ahead of" : "behind";

  const items = [
    {
      question: `What is the current time difference between ${from} and ${to}?`,
      answer: diffMinutes === 0
        ? `${from} and ${to} are currently in the same time zone.`
        : `${to} is ${diffStr} ${dir} ${from}. This means when it is noon in ${from}, it is ${formatReadableTime(12 * 60 + diffMinutes)} in ${to}.`,
    },
    {
      question: overlap.hasOverlap
        ? `What is the best time for a meeting between ${from} and ${to}?`
        : `Is there any business-hours overlap between ${from} and ${to}?`,
      answer: overlap.hasOverlap
        ? `The best time window for a meeting is ${overlap.fromWindowStart}–${overlap.fromWindowEnd} in ${from} (${overlap.toWindowStart}–${overlap.toWindowEnd} in ${to}), giving ${overlap.durationStr} of shared business hours.`
        : `Standard 09:00–17:00 business hours do not overlap between ${from} and ${to}. ${overlap.recommendation ?? "Consider rotating early and late slots to share the scheduling burden."}`,
    },
  ];

  items.push({question: `Do ${from} and ${to} change with daylight saving?`, answer: `These abbreviations name fixed UTC offsets, so this conversion does not change with the date. A city may switch to a different abbreviation in summer. Use the city-based meeting planner for a dated appointment.`});

  return items;
}

function formatReadableTime(totalMinutes) {
  const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const period = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
