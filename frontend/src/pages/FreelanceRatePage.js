import { getExchangeRate, getCachedRate } from "@/lib/exchangeRates";
import { useState, useMemo, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { DollarSign, ArrowRight, Calculator, CheckCircle2, ShieldAlert, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { getCorridor, CORRIDOR_APPROX_RATES, PAYMENT_RAILS, CORRIDORS } from "@/data/freelanceCorridors";

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

export default function FreelanceRatePage() {
  const { corridor } = useParams();
  const corridorData = getCorridor(corridor);

  const defaultHourly = corridorData?.defaultHourly ?? 40;
  const [quote, setQuote] = useState(() => getCachedRate(corridorData?.from, corridorData?.to));
  const rate = quote?.rate ?? NaN;
  useEffect(() => {
    let active = true;
    setQuote(getCachedRate(corridorData?.from, corridorData?.to));
    if (corridorData) getExchangeRate(corridorData.from, corridorData.to).then(value => { if (active) setQuote(value); }).catch(() => { if (active) setQuote(null); });
    return () => { active = false; };
  }, [corridorData]);

  // Interactive State (unconditional)
  const [hourlyRate, setHourlyRate] = useState(defaultHourly);
  const [hoursPerWeek, setHoursPerWeek] = useState(35);
  const [weeksPerYear, setWeeksPerYear] = useState(48);
  const [annualExpensesUSD, setAnnualExpensesUSD] = useState(2400);

  // Calculations (unconditional)
  const calculations = useMemo(() => {
    const grossAnnualSource = hourlyRate * hoursPerWeek * weeksPerYear;
    const netAnnualSource = Math.max(0, grossAnnualSource - annualExpensesUSD);
    const grossAnnualTarget = grossAnnualSource * rate;
    const netAnnualTarget = netAnnualSource * rate;
    const monthlyTarget = netAnnualTarget / 12;

    const w2EquivalentSource = netAnnualSource * 0.78;

    return {
      grossAnnualSource,
      netAnnualSource,
      grossAnnualTarget,
      netAnnualTarget,
      monthlyTarget,
      w2EquivalentSource,
    };
  }, [hourlyRate, hoursPerWeek, weeksPerYear, annualExpensesUSD, rate]);

  if (!corridorData) return <Navigate to="/freelance-rate" replace />;

  const { from, to, fromSymbol, toSymbol, title, marketContext, purchasingPowerContext } = corridorData;

  // Worked example numbers (fixed for SSR rendering)
  const exampleRate = defaultHourly;
  const exampleHours = 30;
  const exampleWeeks = 46;
  const exampleGrossSource = exampleRate * exampleHours * exampleWeeks;
  const exampleGrossTarget = exampleGrossSource * rate;
  const exampleW2 = exampleGrossSource * 0.78;

  // Sibling corridors
  const siblingCorridors = CORRIDORS.filter(c => c.slug !== corridor).slice(0, 4);

  // Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Freelance Rate Calculators", "item": "https://www.globalsync-ai.com/freelance-rate" },
      { "@type": "ListItem", "position": 3, "name": `${from} to ${to}`, "item": `https://www.globalsync-ai.com/freelance-rate/${corridor}` },
    ],
  };

  const faqList = [
    {
      question: `What is a good hourly rate when billing in ${from} for clients in ${to}?`,
      answer: `Set your rate from your own income target, billable time, expenses and client scope. The example inputs here are illustrative, not market salary benchmarks.`
    },
    {
      question: `How does payment processing fee affect my ${from} to ${to} earnings?`,
      answer: `Compare the amount your client pays with what you receive after provider fees, bank fees and currency conversion. Fees depend on countries, currencies, amount and payment method; obtain a current quote before choosing a provider.`
    },
    {
      question: `How do I factor self-employment taxes into my ${from} rate?`,
      answer: `Keep personal taxes separate from the amount your client owes. Estimate business costs and unpaid time from your own records, and get tax guidance appropriate to your jurisdiction.`
    },
    {
      question: `What is the current ${from} to ${to} exchange rate used in calculations?`,
      answer: `The calculator uses a timestamped reference snapshot displayed above. It is an estimate before transfer fees, not a guaranteed payment rate.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Calculate Freelance Earnings from ${from} to ${to}`,
    "step": [
      { "@type": "HowToStep", "name": "Set Hourly Rate", "text": `Determine your billable hourly rate in ${from}.` },
      { "@type": "HowToStep", "name": "Estimate Billable Hours", "text": "Multiply weekly billable hours by annual billable weeks (accounting for vacation)." },
      { "@type": "HowToStep", "name": "Apply Mid-Market Exchange Rate", "text": `Convert the net annual ${from} income to ${to} using live mid-market rates.` },
      { "@type": "HowToStep", "name": "Deduct Payment Rail Fees", "text": "Compare payout options (Wise vs PayPal vs Bank Wire) to maximize net local payout." }
    ]
  };

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead
        title={`${title} | Calculate Earnings & FX Fees`}
        description={`Calculate take-home income when billing in ${from} for ${to} payouts. Compare payment rail fees (Wise vs PayPal), W-2 equivalent, and mid-market conversion.`}
        canonical={`https://www.globalsync-ai.com/freelance-rate/${corridor}`}
        schema={[breadcrumbSchema, faqSchema, howToSchema]}
      />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex flex-wrap items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <Link to="/freelance-rate" className="hover:text-gem-mist">Freelance Rate Calculators</Link>
          <span>/</span>
          <span className="text-gem-mist">{from} to {to}</span>
        </nav>

        {/* H1 */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
          Freelance Rate Calculator: {from} to {to}
        </h1>

        {/* AEO Rate Banner */}
        <div className="bg-gem-gold/10 border border-gem-gold/20 rounded-2xl px-6 py-5 mb-8">
          <p className="text-gem-beige font-semibold text-lg leading-snug mb-2">
            {quote ? `1 ${from} = ${rate.toLocaleString()} ${to}` : "Reference rate unavailable"}
          </p>
          <p className="text-gem-sage text-sm">
            {quote ? `${quote.isFallback ? "Cached · " : ""}${quote.source} · ${quote.date}` : "Try again later for converted estimates."}
          </p>
        </div>

        <AdBanner slot="top" className="mb-8" />

        {/* Interactive Calculator Widget */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gem-gold" />
            Interactive Rate & Take-Home Calculator
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gem-sage mb-1.5 font-medium">
                  Hourly Billing Rate ({from})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gem-sage">{fromSymbol}</span>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-gem-beige font-mono text-sm focus:outline-none focus:border-gem-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gem-sage mb-1.5 font-medium">
                  Billable Hours / Week
                </label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={hoursPerWeek}
                  onChange={e => setHoursPerWeek(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gem-beige font-mono text-sm focus:outline-none focus:border-gem-gold"
                />
              </div>

              <div>
                <label htmlFor="freelanceratepage-field-1" className="block text-xs text-gem-sage mb-1.5 font-medium">
                  Working Weeks / Year
                </label>
                <input id="freelanceratepage-field-1"
                  type="number"
                  min="10"
                  max="52"
                  value={weeksPerYear}
                  onChange={e => setWeeksPerYear(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gem-beige font-mono text-sm focus:outline-none focus:border-gem-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-gem-sage mb-1.5 font-medium">
                  Annual Software & Business Expenses ({from})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gem-sage">{fromSymbol}</span>
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={annualExpensesUSD}
                    onChange={e => setAnnualExpensesUSD(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-gem-beige font-mono text-sm focus:outline-none focus:border-gem-gold"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Output */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-gem-sage uppercase tracking-wider mb-1 font-semibold">
                  Gross Annual Income ({from})
                </div>
                <div className="font-mono text-2xl font-bold text-gem-beige">
                  {fromSymbol}{calculations.grossAnnualSource.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs text-gem-gold uppercase tracking-wider mb-1 font-semibold">
                  Converted Gross Annual ({to})
                </div>
                <div className="font-mono text-2xl font-bold text-gem-gold">
                  {quote ? toSymbol + Math.round(calculations.grossAnnualTarget).toLocaleString() : "—"}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
                  Effective Monthly Income ({to})
                </div>
                <div className="font-mono text-xl font-semibold text-emerald-400">
                  {quote ? toSymbol + Math.round(calculations.monthlyTarget).toLocaleString() : "—"} / month
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs text-gem-sage mb-1">
                  Illustrative income after 22% overhead ({from}):
                </div>
                <div className="font-mono text-sm font-semibold text-gem-beige">
                  ~{fromSymbol}{Math.round(calculations.w2EquivalentSource).toLocaleString()} / year
                </div>
                <div className="text-[11px] text-gem-sage/70 mt-0.5">
                  Assumes 22% overhead for illustration; this is not a tax or salary calculation.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Worked Example Section (Server Rendered) */}
        <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
            Worked Corridor Example: {fromSymbol}{exampleRate}/hr Baseline
          </h2>
          <p className="text-gem-sage text-sm leading-relaxed mb-4">
            Consider a contractor billing <strong className="text-gem-beige">{fromSymbol}{exampleRate}/hour</strong> for{" "}
            <strong className="text-gem-beige">{exampleHours} billable hours/week</strong> across{" "}
            <strong className="text-gem-beige">{exampleWeeks} weeks/year</strong>:
          </p>
          <ul className="space-y-2 text-sm text-gem-beige font-mono bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <li className="flex justify-between">
              <span className="text-gem-sage font-sans">Gross Annual Billing ({from}):</span>
              <span>{fromSymbol}{exampleGrossSource.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gem-sage font-sans">Mid-Market Converted ({to}):</span>
              <span className="text-gem-gold font-bold">{quote ? toSymbol + Math.round(exampleGrossTarget).toLocaleString() : "—"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gem-sage font-sans">Illustrative income after 22% overhead:</span>
              <span>~{fromSymbol}{Math.round(exampleW2).toLocaleString()}</span>
            </li>
          </ul>
          <p className="text-xs text-gem-sage leading-relaxed">
            The 22% overhead assumption is illustrative. Actual taxes, benefits and business costs vary; this example does not calculate them.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">Compare the amount you will receive</h2>
          <p className="text-gem-sage leading-relaxed">Before choosing a payment provider, request a quote for your countries, amount and payment method. Compare the final amount received, all fees, the exchange rate and estimated delivery time. A reference currency conversion does not include those costs.</p>
        </section>

        {/* Local Purchasing Power Context (Human Written Stub) */}
        {purchasingPowerContext && (
          <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
              Local Purchasing Power & Market Insights
            </h2>
            <p className="text-gem-mist leading-relaxed text-sm">{purchasingPowerContext}</p>
          </section>
        )}

        <AdBanner slot="mid" className="mb-8" />

        {/* FAQ Section */}
        <section className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">
            Frequently Asked Questions
          </h2>
          <div>
            {faqList.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Sibling Corridor Links */}
        {siblingCorridors.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading text-lg font-semibold text-gem-beige mb-4">
              Related Freelance Rate Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siblingCorridors.map(c => (
                <Link
                  key={c.slug}
                  to={`/freelance-rate/${c.slug}`}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gem-beige hover:text-gem-gold transition-all"
                >
                  <span>{c.from} to {c.to} Freelance Rate</span>
                  <ArrowRight className="w-4 h-4 text-gem-gold" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation Hub Links */}
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/freelance-rate" className="text-gem-gold hover:underline">← All freelance rate calculators</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/freelancer-rate-converter" className="text-gem-gold hover:underline">Freelancer Rate Converter</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/currency-converter" className="text-gem-gold hover:underline">Currency Converter</Link>
          <span className="text-gem-sage">·</span>
          <Link to="/blog/mid-market-exchange-rate-freelancers" className="text-gem-gold hover:underline">Mid-Market Rate Guide</Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
