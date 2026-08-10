import { Link } from "react-router-dom";
import { DollarSign, ArrowRight, Calculator, Globe, CreditCard } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CORRIDORS } from "@/data/freelanceCorridors";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
    { "@type": "ListItem", "position": 2, "name": "Freelance Rate Calculators", "item": "https://www.globalsync-ai.com/freelance-rate" },
  ],
};

export default function FreelanceRateHubPage() {
  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead
        title="Freelance Rate & Currency Corridor Calculators — GlobalSync AI"
        description="Calculate net freelance earnings across major currency corridors (USD to INR, PHP, PKR, EUR, GBP, BRL, MXN, NGN, CAD & more). Compare payment processing fees and W-2 salary equivalents."
        canonical="https://www.globalsync-ai.com/freelance-rate"
        schema={[breadcrumbSchema]}
      />

      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <span className="text-gem-mist">Freelance Rate Calculators</span>
        </nav>

        {/* H1 + Intro */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <DollarSign className="w-3.5 h-3.5" /> 12 Major Freelance Corridors · FX Fee Analysis
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
            Freelance Rate & Currency Corridor Calculators
          </h1>
          <p className="text-gem-mist text-lg max-w-3xl leading-relaxed">
            Crossing hourly rates with live currency conversion and payment rail fee analysis.
            Designed specifically for international freelancers, agency contractors, and remote engineering teams billing cross-border.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/freelancer-rate-converter"
              className="inline-flex items-center gap-1.5 bg-gem-gold text-gem-forest font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-gem-gold/90 transition-colors"
            >
              <Calculator className="w-4 h-4" /> Freelancer Rate Tool
            </Link>
            <Link
              to="/currency-converter"
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/20 text-gem-beige text-sm rounded-xl px-4 py-2.5 hover:bg-white/10 transition-colors"
            >
              Currency Converter
            </Link>
          </div>
        </header>

        {/* Corridor Grid */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gem-gold" />
            Select Your Currency Corridor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORRIDORS.map(corridor => (
              <Link
                key={corridor.slug}
                to={`/freelance-rate/${corridor.slug}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gem-gold/30 rounded-2xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-gem-beige group-hover:text-gem-gold text-lg transition-colors">
                      {corridor.from} to {corridor.to}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gem-sage group-hover:text-gem-gold transition-colors" />
                  </div>
                  <p className="text-xs text-gem-sage line-clamp-2 leading-relaxed mb-4">
                    {corridor.marketContext}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gem-gold font-medium bg-gem-gold/10 rounded-lg px-3 py-1.5 border border-gem-gold/20 w-fit">
                  <CreditCard className="w-3 h-3" /> Calculate Take-Home & FX Fees
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Value Proposition & Educational Content */}
        <section className="bg-white/3 border border-white/8 rounded-2xl p-6 text-sm text-gem-sage leading-relaxed space-y-4">
          <h2 className="font-heading text-base font-semibold text-gem-beige">Why Currency Corridor Rate Calculation Matters</h2>
          <p>
            When contractors work across international borders, standard currency converters only tell half the story.
            Hidden exchange rate markups (which range from 1% to 4.5% across traditional banks and payment platforms), local tax obligations,
            and self-employment overhead significantly impact actual take-home earnings.
          </p>
          <p>
            Each corridor calculator above evaluates live mid-market benchmark rates against provider fee structures (Wise, Payoneer, PayPal, and SWIFT wires)
            so you can set competitive billing rates and protect your income.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
