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

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <Users className="w-3.5 h-3.5" /> AI-Powered · AI Overlap Score · Up to 5 Cities
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gem-beige leading-tight mb-4">
            Meeting Overlap Planner — Find the Best Time Across Time Zones
          </h1>
          <p className="text-lg text-gem-beige/60 max-w-2xl leading-relaxed">
            Free remote team meeting planner and time zone overlap calculator. Discover your AI Meeting Overlap Score, highlight early morning/late night conflicts, and find the fairest meeting time in seconds.
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

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-2">Popular Meeting Time Combinations</h2>
          <p className="text-gem-beige/60 mb-5 text-sm">Click any scenario to instantly calculate the business hours overlap and view the AI Meeting Score.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OVERLAPS.map(o => (
              <button
                key={o.cities.join("-")}
                onClick={() => navigate(`/dashboard?q=Best meeting time for ${o.cities.join(", ")}`)}
                className="text-left bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-gem-gold/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gem-beige text-sm">{o.cities.join(" + ")}</div>
                    <div className="text-xs text-gem-beige/40 mt-0.5">{o.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gem-beige/20 group-hover:text-gem-gold transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How to find best meeting time */}
        <section className="mb-12 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-6">How the AI Meeting Overlap Score Works</h2>
          <ol className="space-y-4">
            {[
              ["Add Multiple Cities", "Add up to 5 cities where your remote team is located. The AI automatically fetches the local time and normal business hours."],
              ["Calculate Overlap & Penalties", "The system calculates a score from 0 to 100 based on working hour overlaps, too early/late penalties, weekend conflicts, and lunch hour overlaps."],
              ["Review the Fairness Score", "Example: A score of 87/100 means 'Good for New York, London' but 'Hard for India after 9:30 PM'. It helps you identify unfair scheduling."],
              ["Share the Slot", "Once you find the optimal slot, copy the exact meeting times in everyone's local time zone, including DST warnings if applicable."],
            ].map(([title, desc], i) => (
              <li key={title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gem-gold/20 text-gem-gold font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-gem-beige mb-1">{title}</h3>
                  <p className="text-sm text-gem-beige/60">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Editorial — Guide to Cross-Timezone Scheduling */}
        <section className="mb-12 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-5">The Ugly Truth About Global Scheduling</h2>
          <div className="space-y-4 text-gem-beige/70 text-[15px] leading-relaxed">
            <p>
              <strong className="text-gem-beige">Why cross-timezone scheduling is genuinely difficult.</strong> If you manage a team scattered across three continents, you already know that scheduling a simple 30-minute sync can feel like solving a Rubik's cube. You aren't just dealing with hours on a clock; you're dealing with human energy levels, family commitments, and biological clocks. Asking a developer in Tokyo to join a call at 11 PM might technically "work" on paper if you are looking at a spreadsheet of business hours, but they aren't going to be engaged. The mental arithmetic required to find a slot where no one is resentful is exhausting, error-prone, and often leads to what we call "Headquarters Bias"—where the home office always gets the most convenient meeting times. That's exactly why we built this AI-powered tool.
            </p>
            <p>
              <strong className="text-gem-beige">The reality of business-hour overlaps.</strong> When you have two cities relatively close together, like New York and London, things are great—you get a solid 3 to 4-hour window to collaborate synchronously. But the second you add a third city into the mix, like Dubai, Singapore, or Sydney, that comfortable window vanishes completely. Often, there is simply zero overlap across all your locations during standard 9-to-5 working hours. We built our overlap tool to instantly visualize this brutal reality, so you don't waste 20 minutes manually calculating time zones on a whiteboard just to realize a 3-way call is mathematically impossible without someone compromising.
            </p>
            <p>
              <strong className="text-gem-beige">Stop making the same people suffer.</strong> If you don't have a perfect time overlap, someone is going to have to take an off-hours call. The biggest mistake global teams make is forcing the <em>same</em> person or the same regional office to suffer every single time. If your team in India stayed up until 9 PM for a call this week, your US team needs to wake up at 6 AM next week. Rotate the pain. Document the rotation explicitly in your calendar and company handbook so everyone knows the system is fair. Resentment builds quietly when one employee feels their personal time is valued less than their American or European counterparts.
            </p>
            <p>
              <strong className="text-gem-beige">The Asynchronous Imperative: Maybe you don't need a meeting at all?</strong> The most successful remote companies in the world operate on an "async-first" philosophy. If the meeting is just going to be a series of status updates where one person talks and five people listen, kill the meeting immediately. Use tools like Loom to record screen shares, Notion or Google Docs to share written updates, or Slack to coordinate while the other half of the world is sleeping. When your international colleagues wake up, they have all the context they need without ever jumping on a live call. Reserve synchronous meetings strictly for complex problem solving, brainstorming, and emotional check-ins.
            </p>
            <p>
              <strong className="text-gem-beige">The Daylight Saving Time disaster.</strong> Twice a year, international schedules get thrown into complete chaos because the US and Europe change their clocks on different weekends, while much of Asia, Africa, and South America don't change their clocks at all. Your perfectly scheduled 9 AM weekly sync suddenly happens an hour late for half your team. Always pin your recurring calendar invites to one primary local time zone, and use GlobalSync AI to double-check the true meeting time before sending invites during the chaotic transition weeks in March and November. Our database uses the official IANA timezone registry to automatically account for these shifts, ensuring you never miss a call.
            </p>
            <p>
              <strong className="text-gem-beige">How to read the AI Meeting Overlap Score.</strong> Our proprietary scoring system doesn't just look at whether people are awake; it looks at whether the time is actually humane. A score of 95+ means you have found the holy grail: a time where everyone is inside standard working hours. A score in the 70s usually indicates that while the meeting is possible, one participant is being forced to join during dinner time or very early in the morning. A score below 40 is a red flag: you are scheduling a meeting that will actively harm an employee's sleep schedule. Use the score as an objective mediator to prove to your boss that a 2 PM San Francisco meeting is cruel to the team in Manila.
            </p>
            <p>
              By embracing asynchronous communication for standard updates and relying on automated, data-driven overlap planners for your critical live syncs, you can build a global culture that respects everyone's time—no matter what time zone they live in.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-5">
                <h3 className="font-semibold text-gem-beige mb-2">{f.q}</h3>
                <p className="text-sm text-gem-beige/60 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Internal links */}
        <section className="bg-gem-pine/30 rounded-2xl border border-gem-gold/20 p-6">
          <h2 className="font-heading text-lg font-bold text-gem-beige mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-white/5 backdrop-blur-xl rounded-[28px] p-4 border border-white/10 hover:border-gem-gold/50 transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-gem-gold bg-gem-gold/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-gem-beige text-sm">Free World Time Zone Converter</div>
                <div className="text-xs text-gem-beige/50">Live clocks for 25+ cities, EST to IST and more</div>
              </div>
            </Link>
            <Link to="/freelancer-rate-converter" className="bg-white/5 backdrop-blur-xl rounded-[28px] p-4 border border-white/10 hover:border-gem-gold/50 transition-all flex items-center gap-3">
              <TrendingUp className="w-9 h-9 text-gem-gold bg-gem-gold/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-gem-beige text-sm">Freelancer Rate Converter</div>
                <div className="text-xs text-gem-beige/50">Convert rates for global clients</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
