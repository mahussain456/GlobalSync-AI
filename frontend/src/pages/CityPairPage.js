import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Clock, ArrowRight, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { CITIES, CITY_PAIRS, getCityPair, ALL_CITY_PAIR_SLUGS } from "@/data/programmaticData";

// ─── Live clock ───────────────────────────────────────────────────────────────
function LiveClock({ timezone, city, country, abbr }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { timeZone: timezone, weekday: "short", month: "short", day: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <div className="flex-1 bg-white rounded-2xl border border-zinc-200 p-6 text-center">
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{abbr}</div>
      <div className="font-heading text-4xl font-bold text-zinc-900 tabular-nums mb-1">{time}</div>
      <div className="text-sm text-zinc-500 mb-3">{date}</div>
      <div className="font-semibold text-zinc-800">{city}</div>
      <div className="text-xs text-zinc-400">{country}</div>
    </div>
  );
}

// ─── Timezone offset helper ──────────────────────────────────────────────────
function getTimezoneOffsetMinutes(tz) {
  const now = new Date();
  const fmt = (timeZone) =>
    now.toLocaleString("en-US", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
  const parseHM = (s) => {
    const [h, m] = s.split(":").map(n => parseInt(n));
    return (h === 24 ? 0 : h) * 60 + m;
  };
  let diff = parseHM(fmt(tz)) - parseHM(fmt("UTC"));
  if (diff > 12 * 60)  diff -= 24 * 60;
  if (diff < -12 * 60) diff += 24 * 60;
  return diff;
}

// ─── Custom Time Converter Widget ─────────────────────────────────────────────
function CustomTimeConverter({ cityA, cityB }) {
  const [hour,     setHour]     = useState(9);
  const [minute,   setMinute]   = useState(0);
  const [ampm,     setAmpm]     = useState("AM");
  const [reversed, setReversed] = useState(false);

  const fromCity = reversed ? cityB : cityA;
  const toCity   = reversed ? cityA : cityB;

  const fromOffset = getTimezoneOffsetMinutes(fromCity.timezone);
  const toOffset   = getTimezoneOffsetMinutes(toCity.timezone);
  let h24 = hour % 12;
  if (ampm === "PM") h24 += 12;
  const utcMinutes = h24 * 60 + minute - fromOffset;
  const rawOut     = utcMinutes + toOffset;
  const outMinutes = ((rawOut % (24 * 60)) + 24 * 60) % (24 * 60);
  const outH24     = Math.floor(outMinutes / 60);
  const outMin     = outMinutes % 60;
  const outH12     = outH24 % 12 || 12;
  const outAmPm    = outH24 < 12 ? "AM" : "PM";
  const dayShift   = Math.sign(Math.round((rawOut - outMinutes) / (24 * 60)));

  const sel = "border border-zinc-200 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer";

  return (
    <section className="mb-8 bg-white rounded-2xl border border-zinc-200 p-6" data-testid="custom-time-converter">
      <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Convert a Specific Time
      </h2>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <select value={hour} onChange={e => setHour(parseInt(e.target.value))} className={sel} data-testid="hour-select" aria-label="Hour">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
            <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
          ))}
        </select>
        <span className="text-zinc-400 font-bold">:</span>
        <select value={minute} onChange={e => setMinute(parseInt(e.target.value))} className={sel} data-testid="minute-select" aria-label="Minute">
          {[0, 15, 30, 45].map(m => (
            <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
          ))}
        </select>
        <select value={ampm} onChange={e => setAmpm(e.target.value)} className={sel} data-testid="ampm-select" aria-label="AM or PM">
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <span className="text-zinc-400 text-sm">in</span>
        <span className="font-semibold text-zinc-800 text-sm bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
          {fromCity.name}
        </span>
        <button
          onClick={() => setReversed(r => !r)}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-2 transition-colors"
          data-testid="swap-direction-btn"
        >
          <ArrowRight className="w-3 h-3 rotate-90" /> Swap
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="text-xs text-zinc-500 mb-2">
          {hour}:{String(minute).padStart(2, "0")} {ampm} in {fromCity.name} ({fromCity.abbr}) =
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <span className="font-heading text-3xl font-bold text-zinc-900 tabular-nums" data-testid="converted-time-result">
            {outH12}:{String(outMin).padStart(2, "0")} {outAmPm}
          </span>
          <span className="text-zinc-600 font-semibold text-base pb-0.5">
            in {toCity.name} ({toCity.abbr})
          </span>
        </div>
        {dayShift !== 0 && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
            {dayShift > 0 ? "Next day" : "Previous day"} in {toCity.name}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CityPairPage() {
  const { pair } = useParams();
  const pairData = getCityPair(pair);

  if (!pairData) return <Navigate to="/time-zone-converter" replace />;

  const cityA = CITIES[pairData.from];
  const cityB = CITIES[pairData.to];
  const title = `${cityA.name} to ${cityB.name} Time Converter`;
  const h1 = `${cityA.name} to ${cityB.name} Time Converter — Live World Clock`;

  const relatedPairs = pairData.related
    .map(slug => ({ slug, pair: CITY_PAIRS[slug] }))
    .filter(r => r.pair)
    .map(r => ({ slug: r.slug, from: CITIES[r.pair.from], to: CITIES[r.pair.to] }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "url": `https://globalsync-ai.com/time/${pair}`,
    "description": `Live ${cityA.name} to ${cityB.name} time converter. See current local time in both cities and find the best meeting window.`,
    "applicationCategory": "UtilityApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title={`${cityA.name} to ${cityB.name} Time Converter — ${cityA.abbr} to ${cityB.abbr} Live`}
        description={`Convert ${cityA.name} time to ${cityB.name} time instantly. See live clocks for both cities, find the best meeting time, and understand the ${cityA.abbr} to ${cityB.abbr} time difference. Free, no signup.`}
        canonical={`/time/${pair}`}
        keywords={`${cityA.name} to ${cityB.name} time, ${cityA.abbr} to ${cityB.abbr} converter, ${cityA.name} time now, ${cityB.name} time now, time difference ${cityA.name} ${cityB.name}, world clock, free time zone converter`}
        structuredData={structuredData}
      />
      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-zinc-600">Home</Link>
          <span>/</span>
          <Link to="/time-zone-converter" className="hover:text-zinc-600">Time Zone Converter</Link>
          <span>/</span>
          <span className="text-zinc-600">{cityA.name} to {cityB.name}</span>
        </nav>

        {/* H1 */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-100">
            <Clock className="w-3.5 h-3.5" /> Live · Free · No Signup
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900 mb-3">{h1}</h1>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
            Live local time for {cityA.name} and {cityB.name} — updated every second.
            Find the best meeting window and understand the {cityA.abbr} to {cityB.abbr} time difference instantly.
          </p>
        </header>

        {/* Live clocks */}
        <section className="mb-8" aria-label="Live world clocks">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <LiveClock timezone={cityA.timezone} city={cityA.name} country={cityA.country} abbr={cityA.abbr} />
            <div className="hidden sm:flex items-center justify-center text-zinc-300">
              <ArrowRight className="w-6 h-6" />
            </div>
            <LiveClock timezone={cityB.timezone} city={cityB.name} country={cityB.country} abbr={cityB.abbr} />
          </div>
          <p className="text-xs text-zinc-400 text-center">Clocks update every second in real time.</p>
        </section>

        <CustomTimeConverter cityA={cityA} cityB={cityB} />

        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Context */}
        <section className="mb-8 bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">
            {cityA.name} and {cityB.name} Time Difference Explained
          </h2>
          <p className="text-zinc-600 leading-relaxed">{pairData.context}</p>
        </section>

        {/* Working across these cities editorial */}
        <section className="mb-8 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">
            Working Remotely Across {cityA.name} and {cityB.name}
          </h2>
          <div className="space-y-3 text-zinc-600 text-sm leading-relaxed">
            <p>
              The {cityA.abbr} to {cityB.abbr} corridor is one of the most navigated in global remote work. With {cityA.name} serving as {cityA.role} and {cityB.name} as {cityB.role}, this pairing spans real geographic, cultural, and scheduling challenges that benefit from deliberate team habits.
            </p>
            <p>
              <strong className="text-zinc-800">For synchronous collaboration:</strong> Use the time converter above to identify the exact window where both cities fall within their standard 9 AM–5 PM workday. Schedule recurring standups at a fixed local time each week — and always double-check ahead of Daylight Saving Time switches, which can silently shift the gap by an hour on one side without the other team noticing.
            </p>
            <p>
              <strong className="text-zinc-800">For asynchronous workflows:</strong> Leave detailed written updates at the close of your workday so the other city can action them at the start of theirs. Tools like Loom (async video), Notion or Confluence (shared documentation), and Linear or Jira (project tracking) are the backbone of effective async work across the {cityA.name}–{cityB.name} corridor. The more context you provide in each async message, the fewer back-and-forth roundtrips you create.
            </p>
            <p>
              <strong className="text-zinc-800">On meeting fairness:</strong> When the overlap window is small or inconvenient for one side, rotate who takes the off-hours call. A schedule that permanently assigns early mornings to one team or late evenings to another creates invisible resentment. Document the rotation explicitly and review it quarterly. Teams that share the inconvenience equitably maintain stronger collaboration and lower turnover.
            </p>
          </div>
        </section>

        {/* Meeting tip */}
        <section className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Best Meeting Time for {cityA.name} &amp; {cityB.name}
          </h2>
          <p className="text-zinc-700 leading-relaxed">{pairData.meetingTip}</p>
          <Link
            to="/meeting-planner"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Find the best meeting time for any city combination <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">
            Frequently Asked Questions — {cityA.name} to {cityB.name}
          </h2>
          <div className="space-y-4">
            {pairData.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5">
                <h3 className="font-semibold text-zinc-900 mb-2">{faq.q}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use full tool CTA */}
        <section className="mb-8 bg-zinc-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold mb-1">Need more cities?</h2>
            <p className="text-zinc-400 text-sm">Compare up to 5 cities simultaneously and find business-hour overlaps instantly.</p>
          </div>
          <Link
            to="/time-zone-converter"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors"
          >
            Open free time zone converter <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <AdBanner slot="rectangle" className="mb-8" />

        {/* Related pairs */}
        {relatedPairs.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">Related Time Zone Converters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedPairs.map(({ slug, from, to }) => (
                <Link
                  key={slug}
                  to={`/time/${slug}`}
                  className="bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm hover:border-blue-200 transition-all group"
                >
                  <div className="font-semibold text-zinc-800 text-sm group-hover:text-blue-600 transition-colors">
                    {from.name} → {to.name}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{from.abbr} to {to.abbr}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
