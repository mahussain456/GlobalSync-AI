import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Clock, ArrowRight, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { CITIES, CITY_PAIRS, getCityPair, getRelatedCityPairs, ALL_CITY_PAIR_SLUGS } from "@/data/programmaticData";
import { getCityPairSEO } from "@/lib/seo";

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
    <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6 text-center">
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{abbr}</div>
      <div className="font-heading text-4xl font-bold text-gem-beige tabular-nums mb-1">{time}</div>
      <div className="text-sm text-gem-sage mb-3">{date}</div>
      <div className="font-semibold text-gem-beige/90">{city}</div>
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

  const sel = "border border-white/10 rounded-lg px-3 py-2 text-sm font-semibold text-gem-beige/90 bg-white focus:outline-none focus:ring-2 focus:ring-gem-gold/20 cursor-pointer";

  return (
    <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6" data-testid="custom-time-converter">
      <h2 className="font-heading text-xl font-bold text-gem-beige mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gem-gold" />
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
        <span className="font-semibold text-gem-beige/90 text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          {fromCity.name}
        </span>
        <button
          onClick={() => setReversed(r => !r)}
          className="flex items-center gap-1.5 text-xs font-medium text-gem-gold hover:text-gem-gold/80 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors"
          data-testid="swap-direction-btn"
        >
          <ArrowRight className="w-3 h-3 rotate-90" /> Swap
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="text-xs text-gem-sage mb-2">
          {hour}:{String(minute).padStart(2, "0")} {ampm} in {fromCity.name} ({fromCity.abbr}) =
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <span className="font-heading text-3xl font-bold text-gem-beige tabular-nums" data-testid="converted-time-result">
            {outH12}:{String(outMin).padStart(2, "0")} {outAmPm}
          </span>
          <span className="text-gem-mist font-semibold text-base pb-0.5">
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

// ─── 24-Hour Conversion Table ──────────────────────────────────────────────────
function FullDayConversionTable({ cityA, cityB }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const fromOffset = getTimezoneOffsetMinutes(cityA.timezone);
  const toOffset = getTimezoneOffsetMinutes(cityB.timezone);

  return (
    <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6" data-testid="24-hour-table">
      <h2 className="font-heading text-xl font-bold text-gem-beige mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gem-gold" />
        24-Hour Conversion Table: {cityA.name} to {cityB.name}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gem-mist">
          <thead className="text-xs text-zinc-400 uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">{cityA.name} Time ({cityA.abbr})</th>
              <th scope="col" className="px-4 py-3 font-semibold">{cityB.name} Time ({cityB.abbr})</th>
            </tr>
          </thead>
          <tbody>
            {hours.map(h => {
              const utcMinutes = h * 60 - fromOffset;
              const rawOut = utcMinutes + toOffset;
              const outMinutes = ((rawOut % (24 * 60)) + 24 * 60) % (24 * 60);
              const outH24 = Math.floor(outMinutes / 60);
              const outMin = outMinutes % 60;
              const dayShift = Math.sign(Math.round((rawOut - outMinutes) / (24 * 60)));
              
              const fmtH12 = (hour24) => {
                const h12 = hour24 % 12 || 12;
                const ampm = hour24 < 12 ? "AM" : "PM";
                return `${h12}:00 ${ampm}`;
              };

              const outFmt = `${(outH24 % 12 || 12)}:${String(outMin).padStart(2, '0')} ${outH24 < 12 ? 'AM' : 'PM'}`;
              const dayStr = dayShift > 0 ? " (Next Day)" : dayShift < 0 ? " (Previous Day)" : "";

              return (
                <tr key={h} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-2 font-medium text-gem-beige/90">{fmtH12(h)}</td>
                  <td className="px-4 py-2">{outFmt}{dayStr && <span className="text-xs text-zinc-400 ml-1">{dayStr}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CityPairPage() {
  const { pair } = useParams();
  
  const normalizedPair = (pair || "").toLowerCase();
  const [fromSlug, toSlug] = normalizedPair.split("-to-");
  const cityA = CITIES[fromSlug];
  const cityB = CITIES[toSlug];
  const pairData = getCityPair(normalizedPair);

  if (!cityA || !cityB || !pairData) return <Navigate to="/time-zone-converter" replace />;
  const title = `${cityA.name} to ${cityB.name} Time`;
  const h1 = `${cityA.name} to ${cityB.name} Time Converter — Live World Clock`;

  const relatedPairs = getRelatedCityPairs(normalizedPair, 6)
    .map(slug => ({ slug, pair: getCityPair(slug) }))
    .filter(r => r.pair)
    .map(r => ({ slug: r.slug, from: CITIES[r.pair.from], to: CITIES[r.pair.to] }));

  const hasDST = (city) => city.abbr.includes("/");
  const showDSTNote = hasDST(cityA) || hasDST(cityB);
  const DSTcities = [cityA, cityB].filter(hasDST).map(c => c.name).join(" and ");

  const seo = getCityPairSEO({ cityA, cityB, pair, pairData });

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead {...seo} />

      {/* LUXURY HERO BACKGROUND with World Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        {/* Subtle gradient overlay to soften */}
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10"></div>
        {/* World Map Background */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-36 pb-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <Link to="/time-zone-converter" className="hover:text-gem-mist">Time Zone Converter</Link>
          <span>/</span>
          <span className="text-gem-mist">{cityA.name} to {cityB.name}</span>
        </nav>

        {/* H1 */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <Clock className="w-3.5 h-3.5" /> Live · Free · No Signup
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-3">{h1}</h1>
          <p className="text-gem-sage text-lg leading-relaxed max-w-2xl">
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

        <FullDayConversionTable cityA={cityA} cityB={cityB} />

        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Context */}
        {pairData && (
          <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
              Working Hours Overlap Explained
            </h2>
            <p className="text-gem-mist leading-relaxed">{pairData.context}</p>
          </section>
        )}

        {/* Working across these cities editorial */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">
            Working Remotely Across {cityA.name} and {cityB.name}
          </h2>
          <div className="space-y-3 text-gem-mist text-sm leading-relaxed">
            <p>
              The {cityA.abbr} to {cityB.abbr} corridor is one of the most navigated in global remote work. With {cityA.name} serving as {cityA.role} and {cityB.name} as {cityB.role}, this pairing spans real geographic, cultural, and scheduling challenges that benefit from deliberate team habits.
            </p>
            <p>
              <strong className="text-gem-beige/90">For synchronous collaboration:</strong> Use the time converter above to identify the exact window where both cities fall within their standard 9 AM–5 PM workday. Schedule recurring standups at a fixed local time each week — and always double-check ahead of Daylight Saving Time switches, which can silently shift the gap by an hour on one side without the other team noticing.
            </p>
            <p>
              <strong className="text-gem-beige/90">For asynchronous workflows:</strong> Leave detailed written updates at the close of your workday so the other city can action them at the start of theirs. Tools like Loom (async video), Notion or Confluence (shared documentation), and Linear or Jira (project tracking) are the backbone of effective async work across the {cityA.name}–{cityB.name} corridor. The more context you provide in each async message, the fewer back-and-forth roundtrips you create.
            </p>
            <p>
              <strong className="text-gem-beige/90">On meeting fairness:</strong> When the overlap window is small or inconvenient for one side, rotate who takes the off-hours call. A schedule that permanently assigns early mornings to one team or late evenings to another creates invisible resentment. Document the rotation explicitly and review it quarterly. Teams that share the inconvenience equitably maintain stronger collaboration and lower turnover.
            </p>
          </div>
        </section>

        {/* DST callout */}
        {showDSTNote && (
          <section className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="font-heading text-base font-bold text-amber-900 mb-2 flex items-center gap-2">
              ⚠️ Daylight Saving Time Note
            </h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>{DSTcities}</strong> observe{DSTcities.includes(" and ") ? "" : "s"} Daylight Saving Time, which means the time gap between {cityA.name} and {cityB.name} shifts by 1 hour seasonally. Always verify with the live clocks above — especially around the spring and fall DST switch dates.
            </p>
          </section>
        )}

        {/* Meeting tip */}
        {pairData && (
          <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-gem-gold" />
              Best Meeting Times Between {cityA.name} and {cityB.name}
            </h2>
            <p className="text-gem-mist leading-relaxed">{pairData.meetingTip}</p>
            <Link
              to="/meeting-planner"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-gem-gold hover:text-gem-gold/80 transition-colors"
            >
              Find the best meeting time for any city combination <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {/* FAQ */}
        {pairData?.faqs && (
          <section className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-gem-beige mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {pairData.faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-gem-beige p-5">
                  <h3 className="font-semibold text-gem-beige mb-2 flex gap-2">
                    <span className="text-gem-gold font-black">Q.</span> {faq.q}
                  </h3>
                  <p className="text-gem-mist text-sm leading-relaxed flex gap-2">
                    <span className="text-gem-gold font-black">A.</span> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Blog cross-link */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gem-beige/90 mb-0.5">Want a deeper guide on working across time zones?</p>
            <p className="text-xs text-gem-sage">How to schedule meetings fairly, handle DST, and build async habits.</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link to="/blog/remote-team-world-clock-best-practices" className="text-sm font-semibold text-gem-gold hover:text-gem-gold/80 transition-colors flex items-center gap-1">
              Read: World Clock best practices <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Use full tool CTA */}
        <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] text-gem-beige border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold mb-1">Need more cities?</h2>
            <p className="text-zinc-400 text-sm">Compare up to 5 cities simultaneously and find business-hour overlaps instantly.</p>
          </div>
          <Link
            to="/time-zone-converter"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gem-beige font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Open free time zone converter <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <AdBanner slot="rectangle" className="mb-8" />

        {/* Related pairs */}
        <section className="mb-8">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">
            Related Time Zone Converters ({relatedPairs.length} found)
          </h2>
          {relatedPairs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedPairs.map(({ slug, from, to }) => (
                <Link
                  key={slug}
                  to={`/time/${slug}`}
                  className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:shadow-sm hover:border-gem-gold/30 transition-all group"
                >
                  <div className="font-semibold text-gem-beige/90 text-sm group-hover:text-gem-gold transition-colors">
                    Convert Time: {from.name} to {to.name}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{from.abbr} to {to.abbr}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </article>

      <SiteFooter />
    </div>
  );
}
