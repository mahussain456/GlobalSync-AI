import { useNavigate, Link } from "react-router-dom";
import { Clock, ArrowRight, Globe, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CITIES, CITY_PAIRS, ALL_CITY_PAIR_SLUGS } from "@/data/programmaticData";

const FAQ = [
  { q: "What is a time zone converter?", a: "A time zone converter translates a time in one city or region to the corresponding time in another. For example, if it's 9 AM in New York (EST), a converter tells you it's 2 PM in London (GMT) and 7:30 PM in Mumbai (IST)." },
  { q: "How do I convert EST to IST (India Standard Time)?", a: "India Standard Time (IST) is UTC+5:30, which is 10 hours and 30 minutes ahead of EST (UTC-5). To convert: add 10 hours 30 minutes. So 9 AM EST = 7:30 PM IST. Use GlobalSync AI to get live, instant conversions." },
  { q: "What time is 9 AM EST in London?", a: "9 AM EST (Eastern Standard Time, UTC-5) equals 2 PM GMT (London time, UTC+0) during standard time. During British Summer Time (BST, UTC+1), it's 3 PM. GlobalSync AI always accounts for daylight saving changes automatically." },
  { q: "How do I find the best meeting time for teams in different time zones?", a: "The best way is to find the business hour overlap — the window when both (or all) cities are within their 9 AM–5 PM workday. GlobalSync AI's Meeting Overlap tool does this automatically for up to 5 cities at once." },
  { q: "Which cities does GlobalSync AI support?", a: "GlobalSync AI supports 25+ major cities including New York, San Francisco, London, Paris, Berlin, Dubai, Mumbai, Bangalore, Singapore, Tokyo, Seoul, Hong Kong, Shanghai, Sydney, and more. You can also type any city name and the AI will resolve it." },
];

const CONVERSIONS = [
  { from: "New York", to: "London", fromTz: "EST", toTz: "GMT" },
  { from: "San Francisco", to: "Tokyo", fromTz: "PST", toTz: "JST" },
  { from: "London", to: "Dubai", fromTz: "GMT", toTz: "GST" },
  { from: "New York", to: "Mumbai", fromTz: "EST", toTz: "IST" },
  { from: "Sydney", to: "Berlin", fromTz: "AEDT", toTz: "CET" },
  { from: "Singapore", to: "New York", fromTz: "SGT", toTz: "EST" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "GlobalSync AI Time Zone Converter",
      "url": "https://globalsync-ai.com/time-zone-converter",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Free world time zone converter. See live clocks for 25+ cities, find business hour overlaps, and get AI-powered meeting time suggestions."
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQ.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};

export default function TimeZoneConverterPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="Time Zone Converter — World Clock for Remote Teams"
        description="See live clocks for 25+ world cities. Compare New York, London, Tokyo, Dubai, Mumbai and more. Free time zone converter for remote teams and global workers."
        canonical="/time-zone-converter"
        keywords="time zone converter free, EST to IST converter, PST to IST converter, world clock, New York to London time difference, what time is it in Dubai, what time is it in London, IST time now, AI time zone converter, convert time zones, meeting time planner, business hour overlap, remote team tools"
        structuredData={structuredData}
      />

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

        {/* SEO Static Text Block */}
        <section className="mb-12 bg-zinc-50 rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-xl font-bold text-zinc-800 mb-3">Time Zone Converter — Supported Cities &amp; Common Conversions</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Convert time zones between New York (EST/EDT), London (GMT/BST), Tokyo (JST), Dubai (GST), Mumbai (IST), Sydney (AEST), Los Angeles (PST/PDT), Chicago (CST/CDT), Singapore (SGT), and 20+ more cities worldwide. Use our <strong className="text-zinc-700">EST to IST converter</strong> to find the best time to call India from the USA. Check <strong className="text-zinc-700">PST to IST</strong> for US West Coast to India calls. Find the <strong className="text-zinc-700">time difference between New York and London</strong>, or US and Australia. Our <strong className="text-zinc-700">AI time zone converter</strong> lets you ask natural questions like "What time is 3 PM in New York in India?" and get instant answers. Whether you need to know <strong className="text-zinc-700">what time is it in Dubai</strong>, <strong className="text-zinc-700">what time is it in London</strong> right now, or check <strong className="text-zinc-700">IST time now</strong> — GlobalSync AI is the fastest, free time zone converter free of charge, with no sign-up required.
          </p>
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

        {/* Internal links */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">Explore More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/currency-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">$</div>
              <div>
                <div className="font-medium text-zinc-800 text-sm">Currency Converter</div>
                <div className="text-xs text-zinc-400">Live rates for 160+ currencies</div>
              </div>
            </Link>
            <Link to="/meeting-planner" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-orange-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Users className="w-9 h-9 text-orange-500 bg-orange-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Meeting Planner</div>
                <div className="text-xs text-zinc-400">Find the perfect meeting slot</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
