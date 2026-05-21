import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function USIndiaMeetingTimePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gem-forest text-gem-beige relative">
      <SEOHead 
        title="Best Time for US and India Meetings | EST/PST to IST"
        description="Find the best meeting time window between the United States (EST, PST) and India (IST). Overlap charts, DST warnings, and remote team scheduling tips."
        canonical="/us-india-meeting-time"
      />

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
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-gem-beige">
            Best Time for US & India Meetings
          </h1>
          <p className="text-gem-beige/60 text-lg max-w-2xl mx-auto">
            Scheduling across a 9.5 to 12.5 hour time difference is difficult. Here is exactly when to schedule your calls.
          </p>
          <Link
            to="/meeting-planner"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gem-gold text-gem-forest font-bold hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(200,169,106,0.15)]"
          >
            <Clock className="w-4 h-4" /> Open Live Meeting Planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8 mb-12 shadow-2xl">
          <div className="prose prose-invert max-w-none text-gem-beige/70">
            <h2 className="text-2xl font-bold text-gem-beige mb-4">The East Coast Overlap (EST/EDT to IST)</h2>
            <p>
              India Standard Time (IST) is 9 hours and 30 minutes ahead of Eastern Daylight Time (EDT) and 10 hours and 30 minutes ahead of Eastern Standard Time (EST).
            </p>
            <p><strong>The Best Window:</strong> 8:00 AM to 10:30 AM EST (which is 5:30 PM to 8:00 PM in India).</p>
            <p>This catches the US team at the start of their day and the India team at the end of their working hours.</p>

            <h2 className="text-2xl font-bold text-gem-beige mt-8 mb-4">The West Coast Challenge (PST/PDT to IST)</h2>
            <p>
              IST is 12 hours and 30 minutes ahead of Pacific Daylight Time (PDT) and 13 hours and 30 minutes ahead of Pacific Standard Time (PST). Finding a fair overlap here is notoriously difficult.
            </p>
            <p><strong>Option 1 (Morning PST):</strong> 7:30 AM to 9:00 AM PST (8:00 PM to 9:30 PM in India). Tough on India's evening.</p>
            <p><strong>Option 2 (Evening PST):</strong> 8:30 PM to 10:00 PM PST (9:00 AM to 10:30 AM next day in India). Tough on California's night.</p>

            <h2 className="text-2xl font-bold text-gem-beige mt-8 mb-4">Beware of Daylight Saving Time (DST)</h2>
            <p>
              India does not observe Daylight Saving Time. The United States changes its clocks twice a year. This means your perfectly scheduled 9:00 AM EST meeting will suddenly shift for your team in India when the clocks "spring forward" or "fall back." Always use an automated tool like GlobalSync AI's Meeting Planner to prevent DST mixups.
            </p>

            <h2 className="text-2xl font-bold text-gem-beige mt-8 mb-4">Helpful next steps</h2>
            <ul>
              <li><Link to="/meeting-planner" className="text-gem-gold hover:text-gem-gold/80">Use the live meeting planner</Link></li>
              <li><Link to="/time/new-york-to-london" className="text-gem-gold hover:text-gem-gold/80">Compare another major meeting overlap page</Link></li>
              <li><Link to="/blog/best-time-to-work-with-us-clients-india-pakistan-asia" className="text-gem-gold hover:text-gem-gold/80">Read the detailed guide for Asia-based freelancers</Link></li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
