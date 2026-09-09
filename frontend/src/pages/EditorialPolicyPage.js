import { Link } from "react-router-dom";
import { FileText, Edit3, RefreshCw, AlertCircle, Mail, Cpu } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const Section = ({ icon: Icon, title, children }) => (
  <section className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-gem-gold/20 border border-gem-gold/30 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-gem-gold" size={18} />
      </div>
      <h2 className="font-heading text-xl font-bold text-gem-beige">{title}</h2>
    </div>
    <div className="pl-12 space-y-3 text-gem-beige/70 text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

export default function EditorialPolicyPage() {
  const seo = getStaticPageSEO("editorial-policy");
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
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-36 pb-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gem-beige/40 mb-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-beige/80">Home</Link>
          <span>/</span>
          <span className="text-gem-beige/80">Editorial Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-gem-gold/20 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/30">
            <FileText className="w-3.5 h-3.5" /> Editorial Standards
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
            GlobalSync AI: Our Editorial Standards and Accuracy Policy
          </h1>
          <p className="text-gem-beige/60 text-lg leading-relaxed">
            GlobalSync AI is committed to producing accurate, useful, and transparent content about time zones, currency conversion, and remote work. This page explains how we create and maintain that content.
          </p>
          <p className="text-xs text-gem-beige/40 mt-4">Last updated: April 2026</p>
        </header>

        <Section icon={Edit3} title="Content Review Process & Editorial Philosophy">
          <p>
            Every guide, calculator description, and editorial article published on GlobalSync AI undergoes a strict human-in-the-loop content review process. Drafts are written by our founder, Ahmed Hussain, and cross-reviewed for technical consistency, terminology accuracy, and real-world clarity for remote workers.
          </p>
          <p>
            Our review pipeline verifies that all technical steps and calculations (such as timezone conversion offsets, daylight saving transition rules, or salary-to-hourly equivalency calculations) correspond exactly with verified mathematical models and data provider guidelines. We maintain total editorial independence: we do not accept sponsored articles, paid product placements, or native advertising that could bias our reporting or compromise our utility recommendations.
          </p>
          <p>
            Before publication, every article is evaluated against three core principles: clarity, practical utility for distributed teams, and zero fluff. If a guide does not directly help a remote worker or team manager schedule better meetings or understand financial rates, it is revised or discarded.
          </p>
        </Section>

        <Section icon={FileText} title="Accuracy & Data Integrity Policy">
          <p>
            Accuracy is our primary product standard. For our interactive converters, world clocks, and calculation tools, we enforce strict data constraints by relying exclusively on verified institutional data sources:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li><strong className="text-gem-beige">Time zone database:</strong> We build directly on the official IANA Time Zone Database (TZDB), which regulates all global timezone boundaries, historical transitions, and upcoming Daylight Saving Time (DST) switches.</li>
            <li><strong className="text-gem-beige">Live exchange rates:</strong> We pull reference indices from the European Central Bank (ECB) and high-fidelity interbank feeds, updating rate caches hourly to deliver real mid-market values.</li>
            <li><strong className="text-gem-beige">Automated logic verification:</strong> All tool logic runs through continuous unit testing scripts to prevent compounding rounding errors and guarantee mathematical consistency across all currency and timezone calculations.</li>
          </ul>
          <p className="mt-3">
            We explicitly distinguish between reference mid-market exchange rates and retail commercial exchange rates. Our tools show the true mid-market rate so users can evaluate bank markups and hidden fee margins transparently.
          </p>
        </Section>

        <Section icon={Cpu} title="AI Assistance Disclosure">
          <p>
            We utilize artificial intelligence models as supportive tools for brainstorming, copy editing, and structuring initial draft outlines. However, we maintain a strict AI oversight policy to guarantee accuracy:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>All AI-generated suggestions or draft outlines are fully reviewed, edited, expanded, and fact-checked by a human editor before publication.</li>
            <li>We do not delegate mathematical operations, timezone offset logic, or currency conversion calculations to generative AI model parameters. All numerical operations are executed by our deterministic backend APIs to prevent AI hallucinations.</li>
            <li>No article, tool description, or documentation page on GlobalSync AI is published without manual human verification and editorial sign-off.</li>
          </ul>
        </Section>

        <Section icon={RefreshCw} title="Correction & Update Policy">
          <p>
            The global regulatory landscape for currencies and time zones is dynamic. To keep our database accurate and responsive to real-world shifts, we implement the following update schedule:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li><strong className="text-gem-beige">IANA database updates:</strong> We sync and redeploy our timezone database within 48 hours of any official IANA release.</li>
            <li><strong className="text-gem-beige">Currency feed audits:</strong> We verify API integration feeds hourly to catch data provider delays or unexpected volatility flags.</li>
            <li><strong className="text-gem-beige">Static guides & hub content:</strong> We review all editorial guides annually or immediately upon notice of significant regulatory shifts (such as sudden DST rule modifications or currency re-denominations).</li>
          </ul>
          <p className="mt-3">
            If we make a material correction to an article or guide, we update the "last updated" timestamp at the top of the page and add an explicit notice detailing the specific change made.
          </p>
        </Section>

        <Section icon={AlertCircle} title="Contact Path for Corrections & Feedback">
          <p>
            We welcome corrections, bug reports, and feedback from our global community of users. If you identify a typo, a calculation bug, or an outdated fact anywhere on GlobalSync AI, please reach out to us. We commit to:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>Acknowledging and reviewing all correction submissions within 2 business days.</li>
            <li>Routing technical bugs directly to our development logs and deploying hotfixes within 24 hours of confirmation.</li>
            <li>Allowing users to submit corrections by emailing our team directly at <a href="mailto:editorial@globalsync-ai.com" className="text-gem-gold hover:underline">editorial@globalsync-ai.com</a> or submitting a message via our <Link to="/contact" className="text-gem-gold hover:underline">Contact Page</Link>.</li>
          </ul>
        </Section>

        {/* Related links */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/methodology" className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-5 hover:border-white/20 hover:bg-white/5 transition-all group">
            <div className="font-semibold text-gem-beige group-hover:text-gem-gold transition-colors mb-1">Our Methodology →</div>
            <div className="text-sm text-gem-beige/60">How our time zone, currency, and AI systems work</div>
          </Link>
          <Link to="/about" className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-5 hover:border-white/20 hover:bg-white/5 transition-all group">
            <div className="font-semibold text-gem-beige group-hover:text-gem-gold transition-colors mb-1">About GlobalSync AI →</div>
            <div className="text-sm text-gem-beige/60">Who we are and what we're building</div>
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
