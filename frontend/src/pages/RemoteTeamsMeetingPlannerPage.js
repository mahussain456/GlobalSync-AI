import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Users, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

export default function RemoteTeamsMeetingPlannerPage() {
  const seo = getStaticPageSEO("global-meeting-planner-for-remote-teams");
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-12 w-full">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-ink">
            Global Meeting Planner for Remote Teams
          </h1>
          <p className="text-quiet text-lg max-w-2xl mx-auto">
            Stop guessing and start scheduling fair meetings. Our AI-powered overlap calculator protects your team from time zone burnout.
          </p>
          <Link
            to="/meeting-planner"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pine text-paper font-bold hover:opacity-90 transition-all "
          >
            <Users className="w-4 h-4" /> Go to Meeting Planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-surface  rounded-xl border border-line p-8 mb-12 ">
          <h2 className="text-2xl font-bold text-ink mb-4">How Remote Teams Schedule Fair Meetings</h2>
          <div className="prose meridian-prose max-w-none text-quiet">
            <p>
              When a team is distributed across New York, London, and Tokyo, finding a meeting time isn't about convenience—it's about fairness. Over time, recurring late-night or early-morning meetings lead to burnout for team members in marginalized time zones.
            </p>
            <h3 className="text-xl font-semibold text-ink mt-8 mb-3">1. Map the Overlap</h3>
            <p>
              Always start by identifying the "Golden Overlap"—the hours where standard business hours (usually 9 AM to 5 PM local time) overlap for all participants.
            </p>
            <h3 className="text-xl font-semibold text-ink mt-8 mb-3">2. Rotate the Burden</h3>
            <p>
              When no clean overlap exists, implement a rotating meeting schedule. This ensures that no single region permanently bears the burden of taking 10 PM calls.
            </p>
            <h3 className="text-xl font-semibold text-ink mt-8 mb-3">3. Use the AI Meeting Score</h3>
            <p>
              GlobalSync AI introduces the AI Meeting Overlap Score, which evaluates any proposed time slot from 0 to 100 based on local time fairness, weekend collisions, and lunch-hour disruptions.
            </p>
            <h3 className="text-xl font-semibold text-ink mt-8 mb-3">Related resources</h3>
            <ul>
              <li><Link to="/us-india-meeting-time" className="text-pine hover:text-pine">Best time for US and India meetings</Link></li>
              <li><Link to="/blog/remote-team-world-clock-best-practices" className="text-pine hover:text-pine">Remote team world clock best practices</Link></li>
              <li><Link to="/methodology" className="text-pine hover:text-pine">How our overlap recommendations work</Link></li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
