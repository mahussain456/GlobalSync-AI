import { useState, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, CheckCircle2, AlertTriangle, Users, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { getMeetingCorridor, MEETING_CORRIDORS } from "@/data/meetingCorridors";
import { generate24hTable } from "@/lib/timezoneUtils";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-4 flex items-start justify-between gap-4 text-gem-beige hover:text-gem-gold transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-sm leading-snug">{question}</span>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-gem-gold" />
          : <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5 text-gem-sage" />}
      </button>
      {open && (
        <div className="pb-4 text-gem-sage text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function MeetingOverlapPage() {
  const { corridor } = useParams();
  const corridorData = getMeetingCorridor(corridor);

  if (!corridorData) return <Navigate to="/meeting-overlap" replace />;

  const { h1, regionA, regionB, ianaA, ianaB, citiesA, citiesB, recommendedWindow, overlapType, fairnessAdvice, contextCopy } = corridorData;

  const table24h = useMemo(() => generate24hTable(ianaA, ianaB), [ianaA, ianaB]);

  const siblingCorridors = MEETING_CORRIDORS.filter(c => c.slug !== corridor).slice(0, 4);

  // Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Meeting Overlap Guides", "item": "https://www.globalsync-ai.com/meeting-overlap" },
      { "@type": "ListItem", "position": 3, "name": `${regionA} & ${regionB}`, "item": `https://www.globalsync-ai.com/meeting-overlap/${corridor}` },
    ],
  };

  const faqList = [
    {
      question: `What are the best meeting hours between ${regionA} and ${regionB}?`,
      answer: `The optimal window for live syncs is ${recommendedWindow} This captures shared or least-disruptive working hours across both regions.`
    },
    {
      question: `How do we manage team meetings when there is little to no business hours overlap?`,
      answer: `${fairnessAdvice} Implementing an async-first operating system with recorded video loom updates or written status check-ins reduces meeting fatigue.`
    },
    {
      question: `How do Daylight Saving Time transitions affect ${regionA} and ${regionB}?`,
      answer: `Seasonal DST transitions in North America and Europe alter timezone offsets by 1 hour twice a year. Always verify meeting invites around late March and late October/early November when transition weekends mismatch.`
    },
    {
      question: `Can I visualize specific meeting times with multiple team members?`,
      answer: `Yes! Use GlobalSync AI's free Meeting Planner tool to add multiple cities, drag time sliders, and export calendar-ready slots.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead
        title={`${h1} | Meeting Planner Guide`}
        description={`Find optimal meeting times between ${regionA} and ${regionB}. Interactive 24-hour heat map, business hours overlap, and rotation fairness advice.`}
        canonical={`https://www.globalsync-ai.com/meeting-overlap/${corridor}`}
        schema={[breadcrumbSchema, faqSchema]}
      />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex flex-wrap items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <Link to="/meeting-overlap" className="hover:text-gem-mist">Meeting Overlap Guides</Link>
          <span>/</span>
          <span className="text-gem-mist">{regionA} & {regionB}</span>
        </nav>

        {/* H1 */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
          {h1}
        </h1>

        {/* AEO Above-Fold Answer Box */}
        <div className="bg-gem-gold/10 border border-gem-gold/20 rounded-2xl px-6 py-5 mb-8">
          <div className="flex items-center gap-2 text-gem-gold font-semibold text-xs uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" /> Recommended Meeting Window
          </div>
          <p className="text-gem-beige font-semibold text-lg leading-snug mb-3">
            {recommendedWindow}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gem-sage">
            <span><strong>Region A:</strong> {regionA} ({citiesA})</span>
            <span>•</span>
            <span><strong>Region B:</strong> {regionB} ({citiesB})</span>
            <span>•</span>
            <span className="text-gem-gold">{overlapType}</span>
          </div>
        </div>

        <AdBanner slot="top" className="mb-8" />

        {/* Deep Link CTA to Interactive Tool */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading text-lg font-bold text-gem-beige mb-1">
              Need to schedule a multi-city team call?
            </h2>
            <p className="text-gem-sage text-sm">
              Use our interactive Meeting Planner tool to compare multiple team locations with a visual time slider.
            </p>
          </div>
          <Link
            to="/meeting-planner"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gem-gold text-gem-forest font-bold text-sm rounded-xl px-5 py-3 hover:bg-gem-gold/90 transition-colors"
          >
            <Calendar className="w-4 h-4" /> Open Meeting Planner
          </Link>
        </div>

        {/* 24-Hour Overlap Heat Table */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
            24-Hour Schedule Alignment & Overlap Heat Table
          </h2>
          <p className="text-gem-sage text-sm mb-4">
            The table below aligns standard hourly slots between {regionA} and {regionB}. Highlighted green rows indicate hours where both regions fall within 09:00–17:00 business hours.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10 mb-2">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/5 text-gem-sage">
                  <th className="px-4 py-3 font-semibold">{regionA} Time</th>
                  <th className="px-4 py-3 font-semibold">{regionB} Time</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Overlap Alignment</th>
                </tr>
              </thead>
              <tbody>
                {table24h.map(({ fromTime, toTime }, i) => {
                  const hourA = i;
                  const isBizA = hourA >= 9 && hourA < 17;
                  const hourB = parseInt(toTime.split(":")[0], 10);
                  const isBizB = hourB >= 9 && hourB < 17;
                  const isOverlap = isBizA && isBizB;
                  return (
                    <tr key={fromTime} className={`border-t border-white/5 ${isOverlap ? "bg-emerald-900/10" : ""}`}>
                      <td className="px-4 py-2.5 font-mono text-gem-beige">{fromTime}</td>
                      <td className={`px-4 py-2.5 font-mono font-semibold ${isOverlap ? "text-emerald-400" : "text-gem-beige"}`}>
                        {toTime}
                        {isOverlap && <span className="ml-2 text-xs text-emerald-500 font-sans font-normal">Optimal Overlap</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gem-sage/70 hidden sm:table-cell">
                        {isOverlap
                          ? "✅ Shared Business Hours"
                          : isBizA
                          ? `Workday in ${regionA} (${hourB < 9 ? "Off-hours / Sleep in " + regionB : "Evening in " + regionB})`
                          : `Workday in ${regionB}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rotation Fairness Advice */}
        <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-gem-gold" />
            Schedule Rotation & Team Fairness Guidelines
          </h2>
          <p className="text-gem-mist text-sm leading-relaxed mb-4">
            {fairnessAdvice}
          </p>
          <div className="bg-amber-900/10 border border-amber-700/20 rounded-xl p-4 text-xs text-gem-sage space-y-1">
            <strong className="text-amber-400 block mb-1">Async Handoff Best Practice:</strong>
            When live overlap is shorter than 2 hours, establish written end-of-day handoff logs (e.g. key decisions, blockers, and next actions) so the opposite team can pick up work seamlessly.
          </div>
        </section>

        {/* Context Copy Stub */}
        {contextCopy && (
          <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
              Corridor Collaboration Context
            </h2>
            <p className="text-gem-mist text-sm leading-relaxed">{contextCopy}</p>
          </section>
        )}

        <AdBanner slot="mid" className="mb-8" />

        {/* FAQ Section */}
        <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">
            Frequently Asked Questions
          </h2>
          <div>
            {faqList.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Sibling Corridor Links */}
        {siblingCorridors.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading text-lg font-semibold text-gem-beige mb-4">
              Related Meeting Overlap Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siblingCorridors.map(c => (
                <Link
                  key={c.slug}
                  to={`/meeting-overlap/${c.slug}`}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gem-beige hover:text-gem-gold transition-all"
                >
                  <span>{c.h1}</span>
                  <ArrowRight className="w-4 h-4 text-gem-gold flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation Hub Links */}
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/meeting-overlap" className="text-gem-gold hover:underline">← All meeting overlap guides</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/meeting-planner" className="text-gem-gold hover:underline">Global Meeting Planner</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/time-zone-converter" className="text-gem-gold hover:underline">Time Zone Converter</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/blog/async-first-remote-team-operating-system" className="text-gem-gold hover:underline">Async Operating System Guide</Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
