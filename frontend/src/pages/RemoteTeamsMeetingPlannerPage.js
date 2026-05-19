import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Users, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function RemoteTeamsMeetingPlannerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gem-forest text-gem-beige">
      <SEOHead 
        title="Global Meeting Planner for Remote Teams | Time Zone Overlaps"
        description="Schedule fair meetings for remote teams. Find business hour overlaps, check AI Meeting Scores, and avoid time zone burnout with GlobalSync AI."
        canonical="/global-meeting-planner-for-remote-teams"
      />
      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-gem-beige">
            Global Meeting Planner for Remote Teams
          </h1>
          <p className="text-gem-beige/60 text-lg max-w-2xl mx-auto">
            Stop guessing and start scheduling fair meetings. Our AI-powered overlap calculator protects your team from time zone burnout.
          </p>
          <Link
            to="/meeting-planner"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gem-gold text-gem-forest font-bold hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(200,169,106,0.15)]"
          >
            <Users className="w-4 h-4" /> Go to Meeting Planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8 mb-12 shadow-2xl">
          <h2 className="text-2xl font-bold text-gem-beige mb-4">How Remote Teams Schedule Fair Meetings</h2>
          <div className="prose prose-invert max-w-none text-gem-beige/70">
            <p>
              When a team is distributed across New York, London, and Tokyo, finding a meeting time isn't about convenience—it's about fairness. Over time, recurring late-night or early-morning meetings lead to burnout for team members in marginalized time zones.
            </p>
            <h3 className="text-xl font-semibold text-gem-beige mt-8 mb-3">1. Map the Overlap</h3>
            <p>
              Always start by identifying the "Golden Overlap"—the hours where standard business hours (usually 9 AM to 5 PM local time) overlap for all participants.
            </p>
            <h3 className="text-xl font-semibold text-gem-beige mt-8 mb-3">2. Rotate the Burden</h3>
            <p>
              When no clean overlap exists, implement a rotating meeting schedule. This ensures that no single region permanently bears the burden of taking 10 PM calls.
            </p>
            <h3 className="text-xl font-semibold text-gem-beige mt-8 mb-3">3. Use the AI Meeting Score</h3>
            <p>
              GlobalSync AI introduces the AI Meeting Overlap Score, which evaluates any proposed time slot from 0 to 100 based on local time fairness, weekend collisions, and lunch-hour disruptions.
            </p>
            <h3 className="text-xl font-semibold text-gem-beige mt-8 mb-3">Related resources</h3>
            <ul>
              <li><Link to="/us-india-meeting-time" className="text-gem-gold hover:text-gem-gold/80">Best time for US and India meetings</Link></li>
              <li><Link to="/blog/schedule-meetings-across-time-zones-2026" className="text-gem-gold hover:text-gem-gold/80">How to schedule meetings across time zones</Link></li>
              <li><Link to="/methodology" className="text-gem-gold hover:text-gem-gold/80">How our overlap recommendations work</Link></li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
