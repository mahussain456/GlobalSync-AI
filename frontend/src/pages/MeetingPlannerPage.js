import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import MeetingPlanner from '@/components/MeetingPlanner';
import { getMeetingPlannerSEO } from '@/lib/seo';

const FAQ = [
  { q: 'How does the meeting planner find a time?', a: 'Choose two to five cities, a date, a meeting length and local working hours. The planner checks every 15-minute start time and only offers meetings that fit entirely within everyone’s selected hours. The date is the local date in the first city.' },
  { q: 'Does it handle daylight saving time?', a: 'Yes. City-based time zones use the rules available in your browser for the chosen date. Each result includes the local date and time-zone label. Check each occurrence of recurring meetings separately, especially when countries change their clocks on different dates.' },
  { q: 'What if there are no shared working hours?', a: 'A shorter meeting, a different date or agreed changes to working hours may help. For teams far apart, consider an asynchronous update or rotate early and late calls. The planner does not silently move a meeting outside your chosen hours.' },
  { q: 'Can I share the plan or add it to my calendar?', a: 'Copy a link to preserve the cities, date, working hours, duration and selected time. You can also copy everyone’s local times, download an .ics file for Outlook or Apple Calendar, or open a Google Calendar draft. Review the draft before inviting participants.' },
  { q: 'Do I need an account?', a: 'No account is required for this planner. It runs in your browser. A shared link contains the meeting settings you choose, so share it only with the people who need them.' },
  { q: 'Which working schedules are supported?', a: 'Each city can have its own same-day working hours, in 15-minute increments. You can restrict results to Monday–Friday in every city. Local holidays, individual calendars, overnight shifts and custom weekend patterns are not checked.' }
];
export default function MeetingPlannerPage() {
  return <div className="min-h-screen bg-paper text-ink">
    <SEOHead {...getMeetingPlannerSEO({ faqs: FAQ })} /><SiteNav />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16">
      <header className="max-w-3xl mb-8"><h1 className="font-heading text-4xl sm:text-5xl font-semibold leading-tight mb-4">Find a meeting time that works across borders.</h1><p className="text-lg text-quiet leading-relaxed">Choose a date, compare your team's working hours, and take a shared time straight to your calendar.</p></header>
      <MeetingPlanner />
      <section className="mt-14 max-w-3xl" aria-labelledby="meeting-help">
        <h2 id="meeting-help" className="font-heading text-2xl font-semibold mb-6">Plan with everyone's local day in view</h2>
        <p className="text-quiet leading-relaxed mb-6">A time that fits two cities may fall outside working hours in a third. Start with the hours your team actually works, then review every local date before you send an invitation.</p>
        <div className="divide-y divide-line">{FAQ.map(({ q, a }) => <details key={q} className="py-5"><summary className="cursor-pointer font-medium text-ink py-1">{q}</summary><p className="text-quiet mt-3 leading-relaxed">{a}</p></details>)}</div>
      </section>
      <nav aria-label="Continue your client workflow" className="mt-12 border-t border-line pt-6 flex flex-wrap gap-5 text-sm text-pine"><Link className="underline underline-offset-4" to="/time-zone-converter">Compare world clocks</Link><Link className="underline underline-offset-4" to="/freelancer-rate-converter">Set a freelance rate</Link><Link className="underline underline-offset-4" to="/invoice">Create an invoice</Link></nav>
    </main><SiteFooter />
  </div>;
}
