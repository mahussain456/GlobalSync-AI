import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

export default function USIndiaMeetingTimePage() {
  const seo = getStaticPageSEO("us-india-meeting-time");
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-12 w-full">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-ink">
            Best Time for US & India Meetings
          </h1>
          <p className="text-quiet text-lg max-w-2xl mx-auto">
            Scheduling across a 9.5 to 12.5 hour time difference is difficult. Here is exactly when to schedule your calls.
          </p>
          <Link
            to="/meeting-planner"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pine text-paper font-bold hover:opacity-90 transition-all "
          >
            <Clock className="w-4 h-4" /> Open Live Meeting Planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-surface  rounded-xl border border-line p-8 mb-12 ">
          <div className="prose meridian-prose max-w-none text-quiet">
            <h2 className="text-2xl font-bold text-ink mb-4">The East Coast Overlap (EST/EDT to IST)</h2>
            <p>
              India Standard Time (IST) is 9 hours and 30 minutes ahead of Eastern Daylight Time (EDT) and 10 hours and 30 minutes ahead of Eastern Standard Time (EST).
            </p>
            <p><strong>The Best Window:</strong> 8:00 AM to 10:30 AM EST (which is 5:30 PM to 8:00 PM in India).</p>
            <p>This catches the US team at the start of their day and the India team at the end of their working hours.</p>

            <h2 className="text-2xl font-bold text-ink mt-8 mb-4">The West Coast Challenge (PST/PDT to IST)</h2>
            <p>
              IST is 12 hours and 30 minutes ahead of Pacific Daylight Time (PDT) and 13 hours and 30 minutes ahead of Pacific Standard Time (PST). Finding a fair overlap here is notoriously difficult.
            </p>
            <p><strong>Option 1 (Morning PST):</strong> 7:30 AM to 9:00 AM PST (8:00 PM to 9:30 PM in India). Tough on India's evening.</p>
            <p><strong>Option 2 (Evening PST):</strong> 8:30 PM to 10:00 PM PST (9:00 AM to 10:30 AM next day in India). Tough on California's night.</p>

            <h2 className="text-2xl font-bold text-ink mt-8 mb-4">Beware of Daylight Saving Time (DST)</h2>
            <p>
              India does not observe Daylight Saving Time. The United States changes its clocks twice a year. This means your perfectly scheduled 9:00 AM EST meeting will suddenly shift for your team in India when the clocks "spring forward" or "fall back." Always use an automated tool like GlobalSync AI's Meeting Planner to prevent DST mixups.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-8 mb-4">Recommended Next Steps for Distributed Teams</h2>
            <ul>
              <li><Link to="/meeting-planner" className="text-pine hover:text-pine">Use the live meeting planner</Link></li>
              <li><Link to="/time/new-york-to-london" className="text-pine hover:text-pine">Compare another major meeting overlap page</Link></li>
              <li><Link to="/blog/time-zone-converter-guide-international-meetings" className="text-pine hover:text-pine">Read our time zone converter guide</Link></li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
