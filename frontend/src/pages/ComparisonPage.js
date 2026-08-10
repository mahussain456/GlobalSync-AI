import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Check, X, Shield, Sparkles, ArrowRight, Clock, DollarSign, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { getComparison, COMPARISONS } from "@/data/comparisons";

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

export default function ComparisonPage() {
  const { slug } = useParams();
  const comparison = getComparison(slug);

  if (!comparison) return <Navigate to="/time-zone-converter" replace />;

  const { h1, competitorName, metaTitle, metaDescription, competitorStrengths, globalSyncStrengths, verdict, faqs } = comparison;

  const siblingComparisons = COMPARISONS.filter(c => c.slug !== slug);

  // Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Tool Comparisons", "item": `https://www.globalsync-ai.com/compare/${slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={`https://www.globalsync-ai.com/compare/${slug}`}
        schema={[breadcrumbSchema, faqSchema]}
      />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <span className="text-gem-mist">Tool Comparisons</span>
        </nav>

        {/* H1 */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
          {h1}
        </h1>

        <p className="text-gem-mist text-lg mb-8 leading-relaxed">
          An honest, transparent comparison of features, workflow design, and strengths to help remote teams choose the right time zone and currency tools.
        </p>

        <AdBanner slot="top" className="mb-8" />

        {/* Side-by-Side Comparison Box */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Competitor Strengths */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gem-gold font-heading font-bold text-lg mb-4 pb-3 border-b border-white/10">
              <Shield className="w-5 h-5" /> What {competitorName} Does Best
            </div>
            <ul className="space-y-3 text-sm text-gem-sage">
              {competitorStrengths.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* GlobalSync AI Strengths */}
          <div className="bg-gem-gold/10 border border-gem-gold/25 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gem-beige font-heading font-bold text-lg mb-4 pb-3 border-b border-gem-gold/20">
              <Sparkles className="w-5 h-5 text-gem-gold" /> GlobalSync AI Advantages
            </div>
            <ul className="space-y-3 text-sm text-gem-beige">
              {globalSyncStrengths.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-gem-gold flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fair Verdict Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
            Our Honest Verdict
          </h2>
          <p className="text-gem-mist text-base leading-relaxed mb-6">
            {verdict}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/time-zone-converter"
              className="inline-flex items-center gap-2 bg-gem-gold text-gem-forest font-bold text-sm rounded-xl px-5 py-3 hover:bg-gem-gold/90 transition-colors"
            >
              <Clock className="w-4 h-4" /> Try Time Zone Converter
            </Link>
            <Link
              to="/currency-converter"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/20 text-gem-beige font-semibold text-sm rounded-xl px-5 py-3 hover:bg-white/10 transition-colors"
            >
              <DollarSign className="w-4 h-4 text-gem-gold" /> Currency Converter
            </Link>
          </div>
        </section>

        <AdBanner slot="mid" className="mb-8" />

        {/* FAQ Section */}
        <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        {/* Other Comparisons */}
        {siblingComparisons.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading text-lg font-semibold text-gem-beige mb-4">
              Other Tool Comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {siblingComparisons.map(c => (
                <Link
                  key={c.slug}
                  to={`/compare/${c.slug}`}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-gem-beige hover:text-gem-gold transition-all"
                >
                  <span className="line-clamp-1">{c.h1}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gem-gold flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Hub Links */}
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/time-zone-converter" className="text-gem-gold hover:underline">Time Zone Converter</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/meeting-planner" className="text-gem-gold hover:underline">Meeting Planner</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/freelancer-rate-converter" className="text-gem-gold hover:underline">Freelancer Rate Converter</Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
