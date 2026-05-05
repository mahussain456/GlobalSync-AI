import { useNavigate, Link } from "react-router-dom";
import { Clock, ArrowRight, Globe, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CITIES, CITY_PAIRS, ALL_CITY_PAIR_SLUGS } from "@/data/programmaticData";
import { getTimeZoneHubSEO } from "@/lib/seo";

const FAQ = [
  { q: "Why is converting time zones so confusing?", a: "Honestly, because it involves a lot of mental math that most of us just aren't wired to do on the fly. You're dealing with 24 different standard zones, half-hour offsets (looking at you, India), and countries that spring forward or fall back on completely different weekends. That's exactly why we built this tool—so you can stop doing the math." },
  { q: "How do I deal with the massive EST to IST time gap?", a: "The US East Coast to India gap is brutal. IST is 10 hours and 30 minutes ahead of EST. My best advice? Stop trying to calculate it in your head. Just type '9 AM NY in Mumbai' into our dashboard. For live meetings, you're usually looking at a narrow 8:00 AM to 9:30 AM window in New York before the Indian team signs off for the night." },
  { q: "What's the deal with Daylight Saving Time?", a: "DST is the enemy of remote work. The US changes its clocks on the second Sunday of March, but the UK and Europe wait until the last Sunday of March. For three chaotic weeks, the time gap between New York and London shrinks from 5 hours to 4 hours. Our AI automatically tracks all these dates so your meetings don't get messed up." },
  { q: "What is the difference between UTC and GMT?", a: "For everyday work purposes? Nothing. They both represent the exact same time at the Prime Meridian. UTC is the technical standard used by computers and aviation, while GMT is the actual time zone used by the UK during the winter. When you see UTC+0 or GMT, just treat them as the same baseline." },
  { q: "How do I find a meeting time that works for everyone?", a: "If you're dealing with more than two time zones, don't try to guess. Head over to our Meeting Overlap tool, type in your three or four cities, and let it find the green zone where everyone is actually awake and at their desk. If there is no overlap, you'll know someone has to compromise and take an off-hours call." },
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
    <div className="min-h-screen bg-[#050816] text-white">
      <SEOHead {...seo} />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" /> Free Tool · No Signup Required
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Time Zone Converter — Live World Clock
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
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

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Popular Time Zone Conversions</h2>
          <p className="text-white/60 mb-5 text-sm">Click any pair to open it instantly in the dashboard.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CONVERSIONS.map(c => (
              <button
                key={`${c.from}-${c.to}`}
                onClick={() => navigate(`/dashboard?q=time in ${c.to} when it is 9 AM in ${c.from}`)}
                className="text-left bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{c.from} <span className="text-white/40">→</span> {c.to}</div>
                    <div className="text-xs text-white/40 mt-0.5">{c.fromTz} to {c.toTz}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* pSEO index — City-to-city deep-dive converters */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-white mb-2">City-to-City Time Zone Converters</h2>
          <p className="text-white/60 mb-5 text-sm">Dedicated guides for the most popular international city pairs — with live clocks, meeting overlap tips, and FAQs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_CITY_PAIR_SLUGS.map(slug => {
              const pair = CITY_PAIRS[slug];
              const from = CITIES[pair.from];
              const to   = CITIES[pair.to];
              return (
                <Link
                  key={slug}
                  to={`/time/${slug}`}
                  className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-blue-500/50 transition-all group flex items-center justify-between"
                  data-testid={`city-pair-link-${slug}`}
                >
                  <div>
                    <div className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">
                      {from.name} to {to.name} Time
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{from.abbr} → {to.abbr} · Live converter + FAQs</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* How to Convert Time Zones */}
        <section className="mb-12 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">How to Convert Time Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["EST to IST Converter", "Use our EST to IST converter to find the best time to call India from the USA. EST (UTC−5) is 10 hrs 30 min behind IST (UTC+5:30). So 9 AM EST = 7:30 PM IST."],
              ["PST to IST Converter", "Check PST to IST for US West Coast to India calls. PST (UTC−8) is 13 hrs 30 min behind IST. So 8 AM PST = 9:30 PM IST."],
              ["New York to London Time", "Find the time difference between New York and London easily. EST is 5 hours behind GMT. During BST summer, the gap narrows to 4 hours."],
              ["AI Natural Language", 'Ask "What time is 3 PM in New York in India?" or "What time is it in Dubai right now?" and get an instant, accurate answer.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm mb-0.5">{title}</h3>
                  <p className="text-sm text-white/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial — Understanding Time Zones */}
        <section className="mb-12 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-5">Surviving Time Zones: Real Talk for Remote Teams</h2>
          <div className="space-y-4 text-white/70 text-[15px] leading-relaxed">
            <p>
              Let's be honest: working across multiple time zones is exhausting. It's not just about knowing that London is 5 hours ahead of New York. It's about remembering that for three weeks in March, that gap suddenly shrinks to 4 hours because the US springs forward before Europe does. It’s about the sheer panic of staring at a Google Calendar invite and trying to figure out if your 2 PM call is <em>their</em> 2 PM or <em>your</em> 2 PM. We built this tool because we were tired of doing the mental gymnastics required just to schedule a quick sync.
            </p>
            <p>
              <strong className="text-white">The Daylight Saving trap.</strong> If you manage a global team, DST is your worst nightmare. Roughly 70 countries observe it, but they all seem to pick different weekends to change their clocks. Meanwhile, massive hubs like India, the UAE, and Japan don't change their clocks at all. If you have a standing weekly meeting with a developer in Mumbai and a designer in Berlin, your recurring calendar invite is guaranteed to break twice a year. Using a live converter that automatically tracks these local quirks is the only way to stay sane.
            </p>
            <p>
              <strong className="text-white">The 30-minute curveball.</strong> If you've never worked with an Indian team before, the IST (India Standard Time) offset is going to catch you off guard. Instead of a clean hourly gap, India is UTC+5:30. That means if you're in New York, you're not adding 10 hours or 11 hours to your clock—you're adding 10 and a half. It sounds like a minor detail, but it's the number one reason people show up exactly 30 minutes late to cross-continental calls. Don't try to calculate it in your head; just plug it into the AI.
            </p>
            <p>
              <strong className="text-white">How the best remote teams actually operate.</strong> After watching hundreds of distributed companies, we've noticed a pattern among the ones that don't burn out. First, they operate "async-first"—meaning they default to Loom videos, Notion docs, and well-written Slack updates instead of dragging everyone onto a live call. Second, when they <em>do</em> need a live meeting, they rotate the pain. If the San Francisco team woke up early this week to catch the London team, then next week the London team stays online late. It's the only fair way to run a global company.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-[#0A0F1E] rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-white mb-4">Popular Time Zone Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/time/new-york-to-london", label: "Convert Time from New York to London", desc: "EST to GMT" },
              { to: "/time/london-to-tokyo", label: "Convert Time from London to Tokyo", desc: "GMT to JST" },
              { to: "/time/san-francisco-to-new-york", label: "Convert Time from San Francisco to New York", desc: "PST to EST" },
              { to: "/time/dubai-to-mumbai", label: "Convert Time from Dubai to Mumbai", desc: "GST to IST" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-blue-500/50 transition-all group">
                <div className="font-semibold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors leading-tight">{link.label}</div>
                <div className="text-xs text-white/40">{link.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-white mb-4">Planning and policy resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/global-meeting-planner-for-remote-teams" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-blue-500/50 transition-all group">
              <div className="font-semibold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">Global Meeting Planner for Remote Teams</div>
              <div className="text-xs text-white/40">Fair scheduling guidance for distributed teams</div>
            </Link>
            <Link to="/us-india-meeting-time" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-blue-500/50 transition-all group">
              <div className="font-semibold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">US and India Meeting Time Guide</div>
              <div className="text-xs text-white/40">High-intent overlap guide for a major remote-work use case</div>
            </Link>
            <Link to="/editorial-policy" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-blue-500/50 transition-all group">
              <div className="font-semibold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">Editorial Policy</div>
              <div className="text-xs text-white/40">See how guides and pair pages are maintained</div>
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-blue-900/20 rounded-2xl border border-blue-500/20 p-6">
          <h2 className="font-heading text-lg font-bold text-white mb-4">Explore More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/currency-converter" className="bg-[#0A0F1E] rounded-xl p-4 border border-white/10 hover:border-emerald-500/50 transition-all flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-sm">$</div>
              <div>
                <div className="font-medium text-white text-sm">Free Currency Converter — 160+ Live Rates</div>
                <div className="text-xs text-white/50">USD to INR, EUR, GBP, AED, PKR and more</div>
              </div>
            </Link>
            <Link to="/meeting-planner" className="bg-[#0A0F1E] rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-all flex items-center gap-3">
              <Users className="w-9 h-9 text-orange-400 bg-orange-500/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-white text-sm">Meeting Overlap Planner for Remote Teams</div>
                <div className="text-xs text-white/50">Find the best meeting time across any cities</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
