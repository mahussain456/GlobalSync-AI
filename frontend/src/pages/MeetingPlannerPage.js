import { useNavigate, Link } from "react-router-dom";
import { Users, ArrowRight, Clock, TrendingUp, CheckCircle2, Globe } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getMeetingPlannerSEO } from "@/lib/seo";

const FAQ = [
  { q: "What is the best time for a meeting between the US and India?", a: "The US East Coast (EST, UTC-5) and India (IST, UTC+5:30) have a 10.5-hour difference. The best overlap window is typically 8:00–9:30 AM EST, which is 6:30–8:00 PM IST — just before the end of the Indian workday. Use GlobalSync AI to find the exact overlap for your team's cities." },
  { q: "What is the best time for a meeting between the US and the UK?", a: "New York (EST) and London (GMT) have a 5-hour difference. Business hours overlap from 2:00 PM–5:00 PM GMT / 9:00 AM–12:00 PM EST — a 3-hour window. During BST (summer), London is only 4 hours ahead, giving a 4-hour overlap window." },
  { q: "How do I find a meeting time that works for teams in San Francisco, London, and Dubai?", a: "San Francisco (PST, UTC-8), London (GMT, UTC+0), and Dubai (GST, UTC+4) have significant time differences. The best overlap is approximately 4:00–5:00 PM GMT / 8:00 AM PST / 8:00 PM GST. GlobalSync AI calculates this automatically — just type the three cities." },
  { q: "What are business hours in different time zones?", a: "Standard business hours are 9:00 AM to 5:00 PM local time in each city. GlobalSync AI checks these hours for each city and highlights the UTC window where all cities are within their business hours simultaneously." },
  { q: "How does the meeting overlap tool work?", a: "GlobalSync AI converts each city's 9AM–5PM business hours to UTC, then finds the intersection of all these UTC windows. The result is the shared UTC window where every city's team is at work — the ideal meeting time. Results are displayed in each city's local time." },
  { q: "Which time zones have the best overlap with US Eastern Time (EST)?", a: "The best overlaps with US Eastern Time (UTC−5) are: UK/Ireland (GMT, UTC+0) — 3–4 hour morning window; Colombia and Peru (COT/PET, UTC−5) — same time zone; Brazil (BRT, UTC−3) — 2-hour gap with strong overlap. The hardest pairings for East Coast US teams are India (IST) — just 30 minutes of genuine business-hours overlap at the start of the US day; Japan (JST) — virtually no overlap; and Australia (AEST) — inverse day cycle." },
  { q: "What is the best meeting time between Singapore and London?", a: "Singapore (SGT, UTC+8) is 8 hours ahead of London (GMT) in winter, 7 hours during UK Summer Time (BST). There is no standard business-hours overlap. The least disruptive window is 4–6 PM Singapore (8–10 AM London), where Singapore wraps its day and London opens its morning. This requires Singapore team members to take late-afternoon calls — which most find more tolerable than an early-morning start." },
  { q: "How should remote teams handle Daylight Saving Time (DST) transitions?", a: "Build DST-safe processes: always express recurring meetings as 'X time in City Y' rather than a fixed UTC hour, use a live tool (like GlobalSync AI) that auto-adjusts, and communicate proactively when your local DST change is approaching. The US–UK window shifts by 1 hour in spring (the US changes clocks 3 weeks before Europe), which quietly breaks every recurring meeting unless teams pay attention. Confirming times with a live converter before high-stakes calls eliminates DST confusion entirely." },
];

const OVERLAPS = [
  { cities: ["New York", "London"], desc: "3-hour overlap window" },
  { cities: ["San Francisco", "London", "Dubai"], desc: "1-hour overlap window" },
  { cities: ["New York", "Mumbai"], desc: "30-minute overlap" },
  { cities: ["London", "Singapore"], desc: "1-hour overlap window" },
  { cities: ["New York", "Berlin", "Tokyo"], desc: "Find optimal slot" },
  { cities: ["Sydney", "London"], desc: "1-hour overlap window" },
];

export default function MeetingPlannerPage() {
  const navigate = useNavigate();
  const seo = getMeetingPlannerSEO();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead {...seo} />

      <SiteNav />

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

        {/* Editorial — Guide to Cross-Timezone Scheduling */}
        <section className="mb-12 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">The Complete Guide to Scheduling Meetings Across Time Zones</h2>
          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
            <p>
              <strong className="text-zinc-800">Why cross-timezone scheduling is genuinely difficult.</strong> When your team spans multiple continents, meeting scheduling transforms from a simple calendar task into a genuine optimization problem. You're simultaneously balancing 3–5 different 9 AM–5 PM windows, accounting for the seasonal unpredictability of Daylight Saving Time, respecting local cultural work norms (Friday afternoons in the UAE, late starts in Spain, early finishes in Germany), and trying to ensure no single team is permanently assigned the worst time slot. The mental arithmetic alone — especially across half-hour offsets like IST — is error-prone enough to justify a dedicated tool.
            </p>
            <p>
              <strong className="text-zinc-800">How business-hours overlap actually works.</strong> The core calculation converts each city's 9 AM–5 PM local window to UTC, then identifies the intersection. For two cities — say New York (UTC−5) and London (UTC+0) — the overlap is 9 AM–1 PM ET (2–6 PM GMT): a clean 4-hour window in winter. Add a third city like Dubai (UTC+4), and the window shrinks: New York at 9 AM is already 5 PM in Dubai, at the very edge of the workday. Add Singapore (UTC+8), and there is often no overlap at all across all four cities. This is why automated overlap calculation matters: three cities with half-hour offsets involved is practically impossible to do accurately in your head.
            </p>
            <p>
              <strong className="text-zinc-800">Meeting rotation for long-term team fairness.</strong> When a true business-hours overlap doesn't exist, the fairest solution is rotation: alternating which team takes the off-hours slot. A weekly US–India standup might be 8:30 AM New York (7 PM India) one week, then 8:30 PM New York (8 AM India the next morning) the alternate week — spreading the inconvenience equally. Document the rotation explicitly in a shared calendar and review it quarterly. Teams that don't rotate inevitably develop resentment among the group that always gets the early morning or late evening call.
            </p>
            <p>
              <strong className="text-zinc-800">Async-first as the default, sync as the deliberate exception.</strong> The highest-performing distributed teams — at companies like GitLab, Automattic, and Basecamp — operate on an async-first principle: default to written documentation, recorded video updates, and shared project boards; reserve real-time meetings for decisions that genuinely require live discussion. A well-written async message with full context, shared before the other team's working day begins, is often more productive than a meeting where half the participants are mentally absent due to timezone fatigue. Use the overlap tool to identify when sync is possible — but first ask whether the meeting needs to happen at all.
            </p>
            <p>
              <strong className="text-zinc-800">Navigating DST transitions without breaking your schedule.</strong> Daylight Saving Time transitions are the most common cause of missed or mis-scheduled international meetings. The US changes clocks roughly three weeks before Europe each spring, temporarily shifting the New York–London gap from 5 hours to 4 hours. Teams with fixed recurring meetings need to review their schedule each March and October — or use a tool like GlobalSync AI that automatically reflects current DST status. Always express recurring meeting invites as "X time in [City]" rather than a fixed UTC hour to make them DST-resilient by design.
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

        {/* Internal links */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-6">
          <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-blue-600 bg-blue-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Free World Time Zone Converter</div>
                <div className="text-xs text-zinc-400">Live clocks for 25+ cities, EST to IST and more</div>
              </div>
            </Link>
            <Link to="/currency-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-3">
              <TrendingUp className="w-9 h-9 text-emerald-600 bg-emerald-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Live Currency Converter — 160+ Exchange Rates</div>
                <div className="text-xs text-zinc-400">USD to INR, EUR, GBP, AED, PKR and more</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
