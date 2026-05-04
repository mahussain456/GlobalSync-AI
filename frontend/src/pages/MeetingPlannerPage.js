import { useNavigate, Link } from "react-router-dom";
import { Users, ArrowRight, Clock, TrendingUp, CheckCircle2, Globe } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getMeetingPlannerSEO } from "@/lib/seo";

const FAQ = [
  { q: "What is the best time for a meeting between the US and India?", a: "It's tight, but your best window is usually 8:00 AM to 9:30 AM on the East Coast (EST), which translates to 6:30 PM to 8:00 PM in India (IST). The Indian team will be wrapping up their day, and the US team will just be starting. It's not perfect, but it's the only real overlap you get without making someone wake up at 5 AM." },
  { q: "What is the best time for a meeting between the US and the UK?", a: "This is one of the easiest connections to make. You've got a solid 3 to 4-hour window every day. If you aim for anywhere between 9:00 AM and 12:00 PM in New York, that's a very comfortable 2:00 PM to 5:00 PM in London." },
  { q: "How do I find a meeting time for San Francisco, London, and Dubai?", a: "This is where things get messy. When San Francisco is waking up at 8 AM, London is already packing up at 4 PM, and Dubai is having dinner at 8 PM. That 8 AM PST slot is basically your only window, and the folks in Dubai will have to take an evening call." },
  { q: "How does your meeting overlap tool actually work?", a: "It's simple: we take the standard 9-to-5 workday for every city you enter, convert them all into a single universal time format (UTC) in the background, and look for the exact hours where everyone's schedule overlaps. We highlight that 'green zone' for you instantly." },
  { q: "Which time zones are the worst for East Coast US teams?", a: "India (IST) is tough because you only get a 30-minute window of real overlap. But Japan (JST) and Australia (AEST) are arguably the worst—there is literally zero overlap during normal business hours. You have to resort to evening calls or early mornings." },
  { q: "How should we handle Daylight Saving Time changes?", a: "The golden rule: never schedule a recurring meeting using a fixed UTC hour. Always pin it to a specific local time (like '10 AM New York time'). That way, when the clocks change, the meeting shifts naturally for the other side. And always communicate early when your local time is about to change, because Europe and the US change on different weeks!" },
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
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">The Ugly Truth About Global Scheduling</h2>
          <div className="space-y-4 text-zinc-600 text-[15px] leading-relaxed">
            <p>
              <strong className="text-zinc-800">Why cross-timezone scheduling is genuinely difficult.</strong> If you manage a team scattered across three continents, you already know that scheduling a simple 30-minute sync can feel like solving a Rubik's cube. You aren't just dealing with hours on a clock; you're dealing with human energy levels. Asking a developer in Tokyo to join a call at 11 PM might technically "work" on paper, but they aren't going to be engaged. The mental arithmetic required to find a slot where no one is resentful is exhausting. That's why we built this tool.
            </p>
            <p>
              <strong className="text-zinc-800">The reality of business-hour overlaps.</strong> When you have two cities like New York and London, things are great—you get a solid 4-hour window to collaborate. But the second you add a third city, like Dubai or Singapore, that window vanishes. Often, there is simply zero overlap across all your locations. We built our overlap tool to instantly visualize this, so you don't waste 20 minutes calculating time zones just to realize a 3-way call is impossible.
            </p>
            <p>
              <strong className="text-zinc-800">Stop making the same people suffer.</strong> If you don't have a perfect time overlap, someone is going to have to take an off-hours call. The biggest mistake global teams make is forcing the <em>same</em> person to suffer every time. If your team in India stayed up until 9 PM for a call this week, your US team needs to wake up at 6 AM next week. Rotate the pain. Document the rotation explicitly in your calendar so everyone knows the system is fair.
            </p>
            <p>
              <strong className="text-zinc-800">Maybe you don't need a meeting at all?</strong> The best remote companies in the world (think Automattic or GitLab) don't try to force everyone onto Zoom. They operate "async-first." If the meeting is just status updates, kill the meeting. Use Loom, Notion, or Slack to share updates while the other half of the world is sleeping. When they wake up, they have all the context they need without ever jumping on a call. Reserve your live meeting time for actual debates and decisions.
            </p>
            <p>
              <strong className="text-zinc-800">The Daylight Saving disaster.</strong> Twice a year, international schedules get thrown into complete chaos because the US and Europe change their clocks on different weekends. Your perfectly scheduled 9 AM sync suddenly happens an hour late. Always pin your recurring invites to one primary local time (e.g., "10 AM New York time") and let your calendar software handle the rest. And always use a tool like GlobalSync AI to double-check the time before sending invites during March and November!
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
