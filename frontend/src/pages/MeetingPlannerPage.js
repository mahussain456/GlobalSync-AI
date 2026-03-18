import { useNavigate, Link } from "react-router-dom";
import { Users, ArrowRight, Clock, TrendingUp, CheckCircle2, Globe } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";

const FAQ = [
  { q: "What is the best time for a meeting between the US and India?", a: "The US East Coast (EST, UTC-5) and India (IST, UTC+5:30) have a 10.5-hour difference. The best overlap window is typically 8:00–9:30 AM EST, which is 6:30–8:00 PM IST — just before the end of the Indian workday. Use GlobalSync AI to find the exact overlap for your team's cities." },
  { q: "What is the best time for a meeting between the US and the UK?", a: "New York (EST) and London (GMT) have a 5-hour difference. Business hours overlap from 2:00 PM–5:00 PM GMT / 9:00 AM–12:00 PM EST — a 3-hour window. During BST (summer), London is only 4 hours ahead, giving a 4-hour overlap window." },
  { q: "How do I find a meeting time that works for teams in San Francisco, London, and Dubai?", a: "San Francisco (PST, UTC-8), London (GMT, UTC+0), and Dubai (GST, UTC+4) have significant time differences. The best overlap is approximately 4:00–5:00 PM GMT / 8:00 AM PST / 8:00 PM GST. GlobalSync AI calculates this automatically — just type the three cities." },
  { q: "What are business hours in different time zones?", a: "Standard business hours are 9:00 AM to 5:00 PM local time in each city. GlobalSync AI checks these hours for each city and highlights the UTC window where all cities are within their business hours simultaneously." },
  { q: "How does the meeting overlap tool work?", a: "GlobalSync AI converts each city's 9AM–5PM business hours to UTC, then finds the intersection of all these UTC windows. The result is the shared UTC window where every city's team is at work — the ideal meeting time. Results are displayed in each city's local time." },
];

const OVERLAPS = [
  { cities: ["New York", "London"], desc: "3-hour overlap window" },
  { cities: ["San Francisco", "London", "Dubai"], desc: "1-hour overlap window" },
  { cities: ["New York", "Mumbai"], desc: "30-minute overlap" },
  { cities: ["London", "Singapore"], desc: "1-hour overlap window" },
  { cities: ["New York", "Berlin", "Tokyo"], desc: "Find optimal slot" },
  { cities: ["Sydney", "London"], desc: "1-hour overlap window" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "GlobalSync AI Meeting Planner",
      "url": "https://globalsync-ai.com/meeting-planner",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Free meeting overlap planner for remote teams. Find the best meeting time across multiple time zones automatically."
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

export default function MeetingPlannerPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="Meeting Overlap Planner — Best Meeting Time Across Time Zones"
        description="Find the best meeting time across multiple time zones instantly. Check business hour overlaps between cities worldwide. Free meeting planner for remote and global teams."
        canonical="/meeting-planner"
        keywords="meeting overlap planner free, best meeting time US and India, time zone overlap calculator, meeting scheduler multiple time zones, business hours overlap calculator, remote team meeting planner, how to schedule meeting across time zones, meeting planner, best meeting time, remote team tools"
        structuredData={structuredData}
      />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link to="/"><img src="/logo-dark.png" alt="GlobalSync AI" className="h-10 w-auto rounded-lg" /></Link>
          <Link to="/blog" className="text-sm text-zinc-400 hover:text-teal-600 transition-colors hidden sm:block" data-testid="nav-blog-link">Blog</Link>
        </div>
        <ol className="flex items-center gap-2 text-sm text-zinc-400" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/" className="hover:text-teal-600 transition-colors" itemProp="item"><span itemProp="name">Home</span></Link>
            <meta itemProp="position" content="1" />
          </li>
          <span>/</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-zinc-600 font-medium" itemProp="name">Meeting Planner</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-orange-100">
            <Users className="w-3.5 h-3.5" /> AI-Powered · Free · Up to 5 Cities
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
            Meeting Overlap Planner — Find the Best Time Across Time Zones
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            Free remote team meeting planner and time zone overlap calculator. Find the best meeting time US and India, US and UK, or any global combination — in seconds. No signup required.
          </p>
          <button
            onClick={() => navigate("/dashboard?q=Best meeting time for New York, London, Dubai")}
            className="mt-6 btn-gradient rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-2 inline-flex"
            data-testid="meeting-cta-btn"
          >
            <Users className="w-4 h-4" /> Find Meeting Overlap Now <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Ad — below hero */}
        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Popular combinations */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-2">Popular Meeting Time Combinations</h2>
          <p className="text-zinc-500 mb-5 text-sm">Click any scenario to instantly calculate the business hours overlap.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OVERLAPS.map(o => (
              <button
                key={o.cities.join("-")}
                onClick={() => navigate(`/dashboard?q=Best meeting time for ${o.cities.join(", ")}`)}
                className="text-left bg-white rounded-xl border border-zinc-200 p-4 hover:border-orange-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-800 text-sm">{o.cities.join(" + ")}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{o.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How to find best meeting time */}
        <section className="mb-12 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">How to Find the Best Meeting Time</h2>
          <ol className="space-y-4">
            {[
              ["Select Your Cities", "Add up to 5 cities where your remote team is located — use our meeting scheduler for multiple time zones including New York, London, Dubai, Mumbai, Singapore, or any of 25+ cities."],
              ["Business Hours Overlap Calculator", "GlobalSync AI acts as a business hours overlap calculator — it converts each city's 9 AM–5 PM to UTC and finds the intersection, the exact window when everyone is at work simultaneously."],
              ["Visual Timeline", "See a color-coded timeline for each city. Blue = business hours. Green = the overlap window. Instantly understand how to schedule meeting across time zones."],
              ["Best Meeting Time Suggestion", "Get the optimal slot in each city's local time. Handles daylight saving automatically — perfect for remote team meeting planning between the US and India, US and UK, or any global pairing."],
            ].map(([title, desc], i) => (
              <li key={title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-zinc-800 mb-1">{title}</h3>
                  <p className="text-sm text-zinc-500">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* SEO Static Text Block */}
        <section className="mb-12 bg-zinc-50 rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-xl font-bold text-zinc-800 mb-3">Meeting Overlap Planner — How It Works</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            The GlobalSync AI <strong className="text-zinc-700">meeting overlap planner</strong> helps remote teams find the best time to meet across multiple time zones. Check business hour overlaps between the US and India, US and UK, US and Australia, or any combination of global cities. Find the <strong className="text-zinc-700">best meeting time US and India</strong> or schedule meetings between New York, London, and Tokyo simultaneously. Our <strong className="text-zinc-700">time zone overlap calculator</strong> shows exactly when business hours align across 25+ cities. Use it as a <strong className="text-zinc-700">meeting scheduler for multiple time zones</strong>, a <strong className="text-zinc-700">business hours overlap calculator</strong>, or a <strong className="text-zinc-700">remote team meeting planner</strong> — completely free, no signup required. Whether you're learning <strong className="text-zinc-700">how to schedule a meeting across time zones</strong>, this <strong className="text-zinc-700">meeting overlap planner free</strong> tool gives you the answer in seconds.
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
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-6">
          <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-blue-600 bg-blue-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Time Zone Converter</div>
                <div className="text-xs text-zinc-400">Live clocks for 25+ cities</div>
              </div>
            </Link>
            <Link to="/currency-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-3">
              <TrendingUp className="w-9 h-9 text-emerald-600 bg-emerald-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Currency Converter</div>
                <div className="text-xs text-zinc-400">Live rates for 160+ currencies</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
