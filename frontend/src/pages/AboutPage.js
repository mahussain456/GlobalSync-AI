import { Link } from "react-router-dom";
import { Globe, Clock, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GlobalSync AI",
  "url": "https://globalsync-ai.com",
  "description": "Free AI-powered time zone converter, currency converter, and meeting planner for remote teams and global workers.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://globalsync-ai.com/dashboard?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="About GlobalSync AI — Free Time Zone & Currency Tools for Remote Teams"
        description="GlobalSync AI is a free, AI-powered toolkit for remote teams and global workers. Convert time zones, find meeting overlaps, and check live exchange rates for 160+ currencies. No signup required."
        canonical="/about"
        keywords="about GlobalSync AI, remote team tools, time zone converter, currency converter, meeting planner, free tools, AI powered"
        structuredData={structuredData}
      />

      <nav className="max-w-4xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="GlobalSync AI" className="h-8 w-auto" />
        </Link>
        <ol className="flex items-center gap-2 text-sm text-zinc-400" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/" className="hover:text-blue-600 transition-colors" itemProp="item"><span itemProp="name">Home</span></Link>
            <meta itemProp="position" content="1" />
          </li>
          <span>/</span>
          <li><span className="text-zinc-600 font-medium">About</span></li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-100">
            <Globe className="w-3.5 h-3.5" /> Free · AI-Powered · No Signup
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
            About GlobalSync AI
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            A free, AI-powered toolkit built for remote teams, freelancers, and global workers who work across time zones every day.
          </p>
        </header>

        <section className="mb-10 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-4">What is GlobalSync AI?</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            GlobalSync AI is a free online toolkit designed to eliminate the friction of working across time zones and currencies. Whether you are a remote worker scheduling a meeting between New York and Singapore, a freelancer invoicing a client in a different currency, or a team manager coordinating a global standup — GlobalSync AI gives you the answers you need instantly.
          </p>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Unlike traditional conversion tools that require you to remember time zone abbreviations or manually look up exchange rates, GlobalSync AI lets you ask questions in plain English. Just type <em>"Best meeting time for London, Dubai, and Mumbai"</em> or <em>"Convert 500 dollars to euros"</em> and the AI handles the rest.
          </p>
          <p className="text-zinc-600 leading-relaxed">
            The platform is completely free, requires no account or subscription, and is updated with live data. Our goal is to make global collaboration simpler for everyone.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, color: "blue", title: "Time Zone Converter", desc: "See live local clocks for 25+ cities worldwide. Compare time zones side by side and identify who is in the office right now.", link: "/time-zone-converter" },
              { icon: TrendingUp, color: "emerald", title: "Currency Converter", desc: "Get live exchange rates for 160+ currencies worldwide — from USD, EUR, GBP, and JPY to INR, PKR, AED, NGN, and beyond.", link: "/currency-converter" },
              { icon: Users, color: "orange", title: "Meeting Planner", desc: "Automatically find the business hour overlap between up to 5 cities. Get the best meeting time displayed in every city's local time.", link: "/meeting-planner" },
            ].map(({ icon: Icon, color, title, desc, link }) => (
              <Link key={title} to={link} className={`bg-white rounded-2xl border border-zinc-200 p-5 hover:border-${color}-300 hover:shadow-sm transition-all`}>
                <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-4">Our Data Sources</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
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
                  <span className="font-semibold text-zinc-800">{source}:</span>{" "}
                  <span className="text-zinc-500 text-sm">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-4">Who is GlobalSync AI For?</h2>
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
              <div key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                <Zap className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-100 p-7">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-2">Get in Touch</h2>
          <p className="text-zinc-600 text-sm mb-4">Questions, feedback, or partnership enquiries? We'd love to hear from you.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </article>

      <footer className="border-t border-zinc-200 py-6 px-6 mt-10">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <Link to="/" className="hover:text-zinc-600">Home</Link>
          <Link to="/privacy-policy" className="hover:text-zinc-600">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-zinc-600">Terms of Service</Link>
          <Link to="/contact" className="hover:text-zinc-600">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
