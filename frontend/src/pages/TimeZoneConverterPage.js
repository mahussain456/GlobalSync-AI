import { useNavigate, Link } from "react-router-dom";
import { Clock, ArrowRight, Globe, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CITIES, CITY_PAIRS, ALL_CITY_PAIR_SLUGS } from "@/data/programmaticData";
import { getTimeZoneHubSEO } from "@/lib/seo";

const FAQ = [
  { q: "What is a time zone converter?", a: "A time zone converter translates a time in one city or region to the corresponding time in another. For example, if it's 9 AM in New York (EST), a converter tells you it's 2 PM in London (GMT) and 7:30 PM in Mumbai (IST)." },
  { q: "How do I convert EST to IST (India Standard Time)?", a: "India Standard Time (IST) is UTC+5:30, which is 10 hours and 30 minutes ahead of EST (UTC-5). To convert: add 10 hours 30 minutes. So 9 AM EST = 7:30 PM IST. Use GlobalSync AI to get live, instant conversions." },
  { q: "What time is 9 AM EST in London?", a: "9 AM EST (Eastern Standard Time, UTC-5) equals 2 PM GMT (London time, UTC+0) during standard time. During British Summer Time (BST, UTC+1), it's 3 PM. GlobalSync AI always accounts for daylight saving changes automatically." },
  { q: "How do I find the best meeting time for teams in different time zones?", a: "The best way is to find the business hour overlap — the window when both (or all) cities are within their 9 AM–5 PM workday. GlobalSync AI's Meeting Overlap tool does this automatically for up to 5 cities at once." },
  { q: "Which cities does GlobalSync AI support?", a: "GlobalSync AI supports 25+ major cities including New York, San Francisco, London, Paris, Berlin, Dubai, Mumbai, Bangalore, Singapore, Tokyo, Seoul, Hong Kong, Shanghai, Sydney, and more. You can also type any city name and the AI will resolve it." },
  { q: "What is the difference between UTC and GMT?", a: "UTC (Coordinated Universal Time) is the global time standard used for computing, aviation, and international coordination. GMT (Greenwich Mean Time) is the time zone used in the UK and West Africa during winter. For practical conversion purposes, UTC and GMT share the same +0:00 offset. All time zones worldwide are expressed as UTC offsets — EST is UTC−5, IST is UTC+5:30, GST (Dubai) is UTC+4, and so on." },
  { q: "Why does India Standard Time (IST) use a 30-minute offset?", a: "India chose a single national time zone at UTC+5:30 to split the geographic difference across its width — India spans roughly 30 degrees of longitude from east to west. Most countries use whole-hour offsets, but India's 30-minute offset is a deliberate political compromise. In practice: to convert EST to IST add 10 hours 30 minutes; to convert PST to IST add 13 hours 30 minutes. This half-hour quirk consistently surprises international schedulers." },
  { q: "How do Daylight Saving Time (DST) changes affect international meetings?", a: "DST can shift a time gap by 1–2 hours when only one region observes it. The US changes clocks on the second Sunday of March (spring forward) and first Sunday of November (fall back). The UK and EU change on the last Sunday of March and October. Countries like India, UAE, China, and Japan don't observe DST at all. This means the New York–London difference shifts from 5 hours (winter) to 4 hours (summer). GlobalSync AI always shows the correct live gap accounting for current DST status — no manual adjustment needed." },
];

const CONVERSIONS = [
  { from: "New York", to: "London", fromTz: "EST", toTz: "GMT" },
  { from: "San Francisco", to: "Tokyo", fromTz: "PST", toTz: "JST" },
  { from: "London", to: "Dubai", fromTz: "GMT", toTz: "GST" },
  { from: "New York", to: "Mumbai", fromTz: "EST", toTz: "IST" },
  { from: "Sydney", to: "Berlin", fromTz: "AEDT", toTz: "CET" },
  { from: "Singapore", to: "New York", fromTz: "SGT", toTz: "EST" },
];

export default function TimeZoneConverterPage() {
  const navigate = useNavigate();
  const seo = getTimeZoneHubSEO();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead {...seo} />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-100">
            <Clock className="w-3.5 h-3.5" /> Free Tool · No Signup Required
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
            Time Zone Converter — Live World Clock
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            Free AI time zone converter for remote teams and global workers. Check what time is it in London, what time is it in Dubai, or find IST time now — instantly across 25+ cities. No account needed.
          </p>
          <button
            onClick={() => navigate("/dashboard?q=show me time zones")}
            className="mt-6 btn-gradient rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-2 inline-flex"
            data-testid="tz-cta-btn"
          >
            <Globe className="w-4 h-4" /> Open Time Zone Converter <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Ad — below hero */}
        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Popular conversions */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-2">Popular Time Zone Conversions</h2>
          <p className="text-zinc-500 mb-5 text-sm">Click any pair to open it instantly in the dashboard.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CONVERSIONS.map(c => (
              <button
                key={`${c.from}-${c.to}`}
                onClick={() => navigate(`/dashboard?q=time in ${c.to} when it is 9 AM in ${c.from}`)}
                className="text-left bg-white rounded-xl border border-zinc-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-800 text-sm">{c.from} <span className="text-zinc-400">→</span> {c.to}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{c.fromTz} to {c.toTz}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* pSEO index — City-to-city deep-dive converters */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-2">City-to-City Time Zone Converters</h2>
          <p className="text-zinc-500 mb-5 text-sm">Dedicated guides for the most popular international city pairs — with live clocks, meeting overlap tips, and FAQs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_CITY_PAIR_SLUGS.map(slug => {
              const pair = CITY_PAIRS[slug];
              const from = CITIES[pair.from];
              const to   = CITIES[pair.to];
              return (
                <Link
                  key={slug}
                  to={`/time/${slug}`}
                  className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group flex items-center justify-between"
                  data-testid={`city-pair-link-${slug}`}
                >
                  <div>
                    <div className="font-medium text-zinc-800 text-sm group-hover:text-blue-600 transition-colors">
                      {from.name} to {to.name} Time
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{from.abbr} → {to.abbr} · Live converter + FAQs</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* How to Convert Time Zones */}
        <section className="mb-12 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">How to Convert Time Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["EST to IST Converter", "Use our EST to IST converter to find the best time to call India from the USA. EST (UTC−5) is 10 hrs 30 min behind IST (UTC+5:30). So 9 AM EST = 7:30 PM IST."],
              ["PST to IST Converter", "Check PST to IST for US West Coast to India calls. PST (UTC−8) is 13 hrs 30 min behind IST. So 8 AM PST = 9:30 PM IST."],
              ["New York to London Time", "Find the time difference between New York and London easily. EST is 5 hours behind GMT. During BST summer, the gap narrows to 4 hours."],
              ["AI Natural Language", 'Ask "What time is 3 PM in New York in India?" or "What time is it in Dubai right now?" and get an instant, accurate answer.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-zinc-800 text-sm mb-0.5">{title}</h3>
                  <p className="text-sm text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial — Understanding Time Zones */}
        <section className="mb-12 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">Understanding Time Zones: A Guide for Remote Teams</h2>
          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
            <p>
              <strong className="text-zinc-800">What is a time zone?</strong> A time zone is a region of the Earth that observes a uniform standard time. The world is divided into 24 primary zones, each offset from Coordinated Universal Time (UTC) by a whole or half number of hours. When it is noon UTC, it is 7 AM in New York (UTC−5), 1 PM in Berlin (UTC+1), and 5:30 PM in Mumbai (UTC+5:30) — the same moment in time expressed as different local hours. Some countries, like India and Iran, use half-hour offsets; Nepal uses a 45-minute offset. These irregularities make manual time zone math unreliable, especially when Daylight Saving Time enters the picture.
            </p>
            <p>
              <strong className="text-zinc-800">Why Daylight Saving Time creates scheduling complexity.</strong> DST is observed by roughly 70 countries — including the US, Canada, most of Europe, and Australia — but on different dates. The US advances clocks on the second Sunday of March; Europe does it on the last Sunday of March, three weeks later. During those three weeks, the New York–London gap is 4 hours rather than the usual 5. Countries like India, the UAE, China, Singapore, and Japan don't observe DST at all, making those gaps fixed year-round. A reliable time zone tool that automatically reflects current DST status is essential for any team spanning these regions.
            </p>
            <p>
              <strong className="text-zinc-800">The India 30-minute offset — and why it catches teams off guard.</strong> India Standard Time (IST, UTC+5:30) is one of the world's most important time zones for remote work: India has the world's largest freelancing workforce and is a major hub for IT outsourcing. The 30-minute offset consistently surprises schedulers. To convert EST to IST, you add 10 hours and 30 minutes — not a round 10 or 11. To convert PST to IST, add 13 hours 30 minutes. Using a converter removes this cognitive load entirely and prevents the costly mistake of scheduling a client call 30 minutes off.
            </p>
            <p>
              <strong className="text-zinc-800">How distributed teams build sustainable scheduling habits.</strong> High-performing remote teams share three core practices. First, they maintain a shared team clock — a single URL bookmarked by everyone — showing current time in each team location. Second, they define a "core hours window": the daily overlap when all team members are expected to be reachable for synchronous work. For US East Coast–India teams, this is typically 8:00–9:30 AM ET (6:30–8:00 PM IST). For US East Coast–London teams, it's 9 AM–1 PM ET (2–6 PM GMT). Third, they express all meeting invites in the recipient's local time — never UTC — so there's no mental conversion required.
            </p>
            <p>
              <strong className="text-zinc-800">Supported cities and how GlobalSync AI handles time zones.</strong> GlobalSync AI uses IANA timezone identifiers — the same standard as Google Calendar, Slack, and Zoom — ensuring DST transitions, half-hour offsets, and cross-date-line arithmetic are all handled automatically. Supported cities cover the most common remote work corridors: New York, San Francisco, Austin, London, Berlin, Lisbon, Dubai, Mumbai, Singapore, Tokyo, Sydney, and Bali. For any city not in the list, the AI input accepts natural language queries like "What time is 3 PM New York in Mumbai?" and resolves them instantly.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-white rounded-xl border border-zinc-200 p-5">
                <h3 className="font-semibold text-zinc-800 mb-2">{f.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Popular Pairs Links */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">Popular Time Zone Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/time/new-york-to-london", label: "Convert Time from New York to London", desc: "EST to GMT" },
              { to: "/time/london-to-tokyo", label: "Convert Time from London to Tokyo", desc: "GMT to JST" },
              { to: "/time/san-francisco-to-new-york", label: "Convert Time from San Francisco to New York", desc: "PST to EST" },
              { to: "/time/dubai-to-mumbai", label: "Convert Time from Dubai to Mumbai", desc: "GST to IST" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="font-semibold text-zinc-800 text-sm mb-1 group-hover:text-blue-600 transition-colors leading-tight">{link.label}</div>
                <div className="text-xs text-zinc-400">{link.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">Explore More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/currency-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">$</div>
              <div>
                <div className="font-medium text-zinc-800 text-sm">Free Currency Converter — 160+ Live Rates</div>
                <div className="text-xs text-zinc-400">USD to INR, EUR, GBP, AED, PKR and more</div>
              </div>
            </Link>
            <Link to="/meeting-planner" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-orange-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Users className="w-9 h-9 text-orange-500 bg-orange-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Meeting Overlap Planner for Remote Teams</div>
                <div className="text-xs text-zinc-400">Find the best meeting time across any cities</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
