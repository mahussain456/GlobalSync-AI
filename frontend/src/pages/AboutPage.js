import { Link } from "react-router-dom";
import { Globe, Clock, TrendingUp, Users, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GlobalSync AI",
  "url": "https://www.globalsync-ai.com",
  "description": "Free AI-powered time zone converter, currency converter, and meeting planner for remote teams and global workers.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.globalsync-ai.com/dashboard?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function AboutPage() {
  const seo = getStaticPageSEO("about");
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-500/20">
            <Globe className="w-3.5 h-3.5" /> Free · AI-Powered · No Signup
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            About GlobalSync AI
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            A free, AI-powered toolkit built for remote teams, freelancers, and global workers who work across time zones every day.
          </p>
        </header>

        <section className="mb-10 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">The Story Behind GlobalSync AI</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Hi, I'm Ahmed Hussain. A few years ago, I was managing a completely distributed engineering team spread across New York, London, and Tokyo. I cannot tell you how many times I accidentally scheduled a critical client call when it was 2 AM for one of our lead developers, or how much money I lost on freelance invoices because I didn't understand the hidden bank fees in currency conversions.
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            I got tired of having 14 browser tabs open just to figure out what time it was, so I built GlobalSync AI. It's a toolkit designed specifically to eliminate the friction of working globally. Unlike clunky dropdown menus on standard time converters, I hooked this up to an AI so you can just type naturally—like <em>"Best meeting time for London, Dubai, and Mumbai"</em> or <em>"Convert 500 dollars to euros."</em>
          </p>
          <p className="text-white/70 leading-relaxed">
            I kept it completely free. There are no paywalls, no forced account signups, and no aggressive tracking. My goal is just to make remote work a little less exhausting for everyone.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, color: "blue", title: "Time Zone Converter", desc: "See live local clocks for 25+ cities worldwide. Compare time zones side by side and identify who is in the office right now.", link: "/time-zone-converter" },
              { icon: TrendingUp, color: "emerald", title: "Currency Converter", desc: "Get live exchange rates for 160+ currencies worldwide — from USD, EUR, GBP, and JPY to INR, PKR, AED, NGN, and beyond.", link: "/currency-converter" },
              { icon: Users, color: "orange", title: "Meeting Planner", desc: "Automatically find the business hour overlap between up to 5 cities. Get the best meeting time displayed in every city's local time.", link: "/meeting-planner" },
            ].map(({ icon: Icon, color, title, desc, link }) => (
              <Link key={title} to={link} className={`bg-[#0A0F1E] rounded-2xl border border-white/10 p-5 hover:border-${color}-500/50 hover:bg-white/5 transition-all`}>
                <div className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">How GlobalSync AI Makes Money</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            GlobalSync AI is free to use. Over time, the site may earn money through clearly labeled display advertising, affiliate partnerships, or product recommendations. Those relationships do not change how the core tools work or how editorial content is written.
          </p>
          <p className="text-white/70 leading-relaxed">
            We aim to keep advertising separate from utility pages and to publish methodology, editorial, and contact information openly so users can judge the site on its merits.
          </p>
        </section>

        <section className="mb-10 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Meet the Creator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                AH
              </div>
              <div>
                <h3 className="font-semibold text-white">Ahmed Hussain</h3>
                <div className="text-sm text-blue-400 mb-2">Founder & Developer</div>
                <p className="text-sm text-white/60 leading-relaxed">
                  I'm a developer and remote work advocate who got tired of the mental math required to manage global teams. I built GlobalSync AI to solve my own scheduling nightmares, and now I'm sharing it with you.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                GC
              </div>
              <div>
                <h3 className="font-semibold text-white">Global Contributors</h3>
                <div className="text-sm text-emerald-400 mb-2">The Remote Community</div>
                <p className="text-sm text-white/60 leading-relaxed">
                  This tool wouldn't be possible without the ongoing feedback from digital nomads, freelance designers, and remote engineering teams who constantly tell me how to make it better.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Our Data Sources</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            We believe in transparency about where our data comes from. GlobalSync AI uses the following sources:
          </p>
          <ul className="space-y-3">
            {[
              ["ExchangeRate-API", "Live currency exchange rates for 160+ currencies, updated daily from global forex market data."],
              ["Frankfurter API (European Central Bank)", "7-day historical rate trend data for 31 major ECB-tracked currency pairs."],
              ["IANA Time Zone Database", "Industry-standard time zone data used by browsers worldwide for accurate, DST-aware time conversions."],
              ["Claude AI (Anthropic)", "Natural language processing to understand and parse free-text queries, extracting cities, currencies, and intent."],
            ].map(([source, desc]) => (
              <li key={source} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div>
                  <span className="font-semibold text-white">{source}:</span>{" "}
                  <span className="text-white/60 text-sm">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Who is GlobalSync AI For?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Remote workers coordinating with global teammates",
              "Freelancers and contractors working with international clients",
              "Team managers scheduling cross-timezone standups",
              "Travellers tracking home time vs destination time",
              "Businesses monitoring international office hours",
              "Developers and engineers on distributed teams",
              "Finance professionals tracking live exchange rates",
              "Students and academics collaborating internationally",
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-white/60">
                <Zap className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-900/20 rounded-2xl border border-blue-500/20 p-7">
          <h2 className="font-heading text-xl font-bold text-white mb-2">Get in Touch</h2>
          <p className="text-white/60 text-sm mb-4">Questions, feedback, or partnership enquiries? We'd love to hear from you.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </article>

      <SiteFooter />
    </div>
  );
}
