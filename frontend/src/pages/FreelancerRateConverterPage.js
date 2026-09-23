import { getExchangeRate } from '@/lib/exchangeRates';
import { annualRevenue } from '@/lib/freelanceRates';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { getStaticPageSEO } from '@/lib/seo';
import { fireAnalyticsEvent } from '@/lib/analytics';

const CURRENCIES = ['USD', 'INR', 'PKR', 'EUR', 'GBP', 'AED', 'NGN', 'PHP', 'ZAR', 'CAD', 'AUD'];
const inputClass = 'w-full bg-paper border border-line rounded-xl px-4 py-3 text-ink';
const faqs = [
  { q: 'How do I estimate annual freelance revenue?', a: 'For hourly work, multiply your rate by billable hours per week and working weeks per year. For a monthly retainer, multiply by 12. For fixed projects, multiply the project fee by projects per year. These are gross revenue estimates before expenses and taxes.' },
  { q: 'Is this a take-home pay or salary calculator?', a: 'No. This tool converts a quoted rate and estimates gross annual revenue. It does not calculate taxes, employment benefits, payment fees, purchasing power, or an equivalent employee salary.' },
  { q: 'Can I reuse my rate in an invoice?', a: 'Yes. Choose Use this rate in an invoice to carry the original rate, billing currency and billing type into the invoice builder. Your valid settings are saved in this browser.' }
];
function saved() {
  try {
    const settings = JSON.parse(localStorage.getItem('gs_freelance_settings') || 'null');
    if (settings && CURRENCIES.includes(settings.base) && CURRENCIES.includes(settings.target) && ['hourly','monthly','project'].includes(settings.type) && annualRevenue(settings.amount, settings.type, settings.units, settings.weeks) !== null) return settings;
  } catch { /* Browser storage is optional. */ }
  return { amount: '50', base: 'USD', target: 'INR', type: 'hourly', units: '25', weeks: '46' };
}
export default function FreelancerRateConverterPage() {
  const [settings, setSettings] = useState(saved);
  const { amount, base, target, type, units, weeks } = settings;
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const total = annualRevenue(amount, type, units, weeks);
  const valid = total !== null;
  const update = patch => setSettings(current => ({ ...current, ...patch }));
  const money = (value, currency) => new Intl.NumberFormat(undefined, { style:'currency', currency, maximumFractionDigits:2 }).format(value);
  useEffect(() => {
    if (!valid) return;
    try {
      localStorage.setItem('gs_freelance_settings', JSON.stringify(settings));
      localStorage.setItem('gs_rate_amount', String(amount));
      localStorage.setItem('gs_rate_type', type);
      localStorage.setItem('gs_rate_currency', base);
    } catch { /* Calculation works even when storage is unavailable. */ }
  }, [settings, valid, amount, type, base]);
  useEffect(() => {
    let active = true;
    setQuote(null); setLoading(true); setError('');
    getExchangeRate(base, target).then(value => { if (active) setQuote(value); })
      .catch(() => { if (active) setError('The reference rate is unavailable. Try again or use the annual estimate in your billing currency.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [base, target, attempt]);
  const unit = type === 'hourly' ? 'per hour' : type === 'monthly' ? 'per month' : 'per project';
  return <div className="min-h-screen flex flex-col bg-paper text-ink">
    <SEOHead {...getStaticPageSEO('freelancer-rate-converter', { faqs })} /><SiteNav />
    <main id="main-content" className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-12 w-full">
      <header className="mb-10"><p className="text-pine text-sm mb-2">Free freelance pricing tool · Updated September 23, 2026</p>
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">Freelance rate converter & annual revenue calculator</h1>
        <p className="text-quiet text-lg">Convert an hourly rate, monthly retainer or project fee across 11 currencies. Estimate your gross annual revenue and carry your rate into an invoice.</p></header>
      <section aria-label="Freelance rate calculator" className="bg-surface rounded-xl border border-line p-5 sm:p-8 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="text-sm space-y-2">Rate Amount<input type="number" min="0" step="any" value={amount} onChange={e => update({amount:e.target.value})} className={inputClass} /></label>
          <label className="text-sm space-y-2">Billing Type<select value={type} onChange={e => update({type:e.target.value, units:e.target.value === 'project' ? '8' : '25'})} className={inputClass}><option value="hourly">Hourly Rate</option><option value="monthly">Monthly Retainer</option><option value="project">Fixed Project Fee</option></select></label>
          <label className="text-sm space-y-2">Base Currency<select value={base} onChange={e => update({base:e.target.value})} className={inputClass}>{CURRENCIES.map(code => <option key={code}>{code}</option>)}</select></label>
          <label className="text-sm space-y-2">Target Currency<select value={target} onChange={e => update({target:e.target.value})} className={inputClass}>{CURRENCIES.map(code => <option key={code}>{code}</option>)}</select></label>
          {type !== 'monthly' && <label className="text-sm space-y-2">{type === 'hourly' ? 'Billable hours per week' : 'Projects per year'}<input type="number" min="0" max={type === 'hourly' ? '168' : undefined} step="any" value={units} onChange={e => update({units:e.target.value})} className={inputClass} /></label>}
          {type === 'hourly' && <label className="text-sm space-y-2">Working weeks per year<input type="number" min="0" max="52" step="any" value={weeks} onChange={e => update({weeks:e.target.value})} className={inputClass} /></label>}
        </div>
        {!valid && <p role="alert" className="mt-5 text-orange-800">Enter non-negative numbers. Use at most 168 billable hours per week and 52 working weeks per year.</p>}
        <div aria-live="polite" className="mt-8 border-t border-line pt-6 space-y-4">
          <p className="text-sm text-quiet">Converted rate · {unit}</p>
          <p className="text-3xl font-bold text-pine">{valid && quote ? money(Number(amount) * quote.rate, target) : '—'}</p>
          <p className="text-sm text-quiet">{loading ? 'Loading reference rate…' : quote ? `${quote.isFallback ? 'Cached · ' : ''}${quote.source} · ${quote.date}` : error}</p>
          {!loading && !quote && <button onClick={() => setAttempt(attempt + 1)} className="underline">Retry reference rate</button>}
          <h2 className="font-heading text-xl">Estimated gross annual revenue</h2>
          <p className="text-2xl font-semibold">{valid ? money(total, base) : '—'}{valid && quote && base !== target ? ` ≈ ${money(total * quote.rate, target)}` : ''}</p>
          <p className="text-sm text-quiet">Before taxes, expenses, payment fees and exchange-rate changes. This is not an employee salary or take-home pay estimate.</p>
          {valid && <Link to="/invoice" className="btn-primary inline-flex" onClick={() => fireAnalyticsEvent('rate_to_invoice', {tool:'freelance_rate', billing_type:type})}>Use this rate in an invoice</Link>}
          <p className="text-xs text-quiet">Your valid settings are remembered in this browser. No signup required.</p>
        </div>
      </section>
      <section className="space-y-5 mb-10"><h2 className="font-heading text-2xl">How the estimate works</h2>
        <p className="text-quiet">At $50 per hour, 25 billable hours per week and 46 working weeks, gross annual revenue is $57,500. A $2,000 monthly retainer is $24,000 per year. Eight projects at $3,000 each also produce $24,000 in gross revenue.</p>
        <p className="text-quiet">Currency conversion multiplies your amount by the dated reference rate shown above. The amount you receive depends on your payment provider's rate and fees. Compare the provider's quote before sending an invoice.</p>
        <Link to="/methodology" className="underline">Read our calculation methodology</Link>
      </section>
      <section className="space-y-5 mb-10"><h2 className="font-heading text-2xl">Common questions</h2>{faqs.map(faq => <div key={faq.q}><h3 className="font-semibold mb-2">{faq.q}</h3><p className="text-quiet">{faq.a}</p></div>)}</section>
      <nav aria-label="Related tools" className="flex flex-wrap gap-5"><Link to="/freelance-rate/usd-to-inr" className="underline">USD to INR freelance rates</Link><Link to="/currency-converter" className="underline">Currency converter</Link><Link to="/meeting-planner" className="underline">Plan a client meeting</Link></nav>
    </main><SiteFooter />
  </div>;
}
