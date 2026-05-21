import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, Clock, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CURRENCIES_META, CURRENCY_PAIRS, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";
import { getCurrencyHubSEO } from "@/lib/seo";
import CurrencyConverter from "@/components/CurrencyConverter";

const FAQ = [
  { q: "Why is the rate I see here different from what my bank gives me?", a: "Welcome to the world of hidden fees! The rate you see here is the 'mid-market' rate—the true, pure exchange rate that banks use to trade with each other. But when you go to your bank or PayPal to actually convert money, they shave off a percentage (usually 2-4%) as their profit margin. You're never going to get the exact mid-market rate in your bank account, but knowing it helps you realize exactly how much you're being overcharged." },
  { q: "Should I invoice my international clients in my currency or theirs?", a: "This is the million-dollar question for freelancers. If you invoice in their currency (like USD), you are taking on all the 'currency risk'—if the dollar tanks before they pay you, you lose money. If you invoice in your local currency, the client takes the risk. Generally, clients prefer to pay in their native currency, so you'll usually have to eat the risk. My advice? Bake a 3-5% buffer into your pricing to cover sudden rate drops." },
  { q: "What's the best time to convert my money?", a: "It's tempting to watch the charts like a Wall Street day trader, but honestly, you'll drive yourself crazy. If you have a massive invoice, check the 7-day trend chart. If your currency is on a clear downward slide, you might want to wait a few days to convert. Otherwise, just pick a day of the month to do all your conversions consistently." },
  { q: "How accurate are the rates on GlobalSync?", a: "They are real-time and pulled directly from the European Central Bank and ExchangeRate-API. It's the same baseline data that the big financial institutions look at. Just remember, it's the interbank rate, not the retail rate your local bank teller will hand you." },
  { q: "Which currencies do you support?", a: "Pretty much all of them! We track over 160 currencies globally. Whether you're getting paid in USD, Euros, Nigerian Naira, or Pakistani Rupees, you can check the exact conversion value right here." },
];

const PAIRS = [
  { from: "USD", to: "EUR", name: "US Dollar to Euro" },
  { from: "USD", to: "INR", name: "US Dollar to Indian Rupee" },
  { from: "USD", to: "GBP", name: "US Dollar to British Pound" },
  { from: "USD", to: "PKR", name: "US Dollar to Pakistani Rupee" },
  { from: "USD", to: "AED", name: "US Dollar to UAE Dirham" },
  { from: "EUR", to: "GBP", name: "Euro to British Pound" },
  { from: "GBP", to: "INR", name: "British Pound to Indian Rupee" },
  { from: "USD", to: "JPY", name: "US Dollar to Japanese Yen" },
  { from: "USD", to: "SAR", name: "US Dollar to Saudi Riyal" },
];

export default function CurrencyConverterPage() {
  const navigate = useNavigate();
  const seo = getCurrencyHubSEO();
  const [selectedPair, setSelectedPair] = useState("");

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
            backgroundImage: "url('/world-map-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-36 pb-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <TrendingUp className="w-3.5 h-3.5" /> Live Rates · 160+ Currencies · Free
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gem-beige leading-tight mb-4">
            Free Currency Converter — Live Exchange Rates
          </h1>
          <p className="text-lg text-gem-beige/60 max-w-2xl leading-relaxed">
            Convert between 160+ currencies with real-time exchange rates. USD to EUR, USD to INR, USD to PKR, AED, SAR, NGN and more — updated daily from global forex markets.
          </p>
          <div className="mt-8">
            <CurrencyConverter />
          </div>
        </header>

        {/* Ad — below hero */}
        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Popular pairs */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-2">Popular Currency Pairs</h2>
          <p className="text-gem-beige/60 mb-5 text-sm">Click any pair to open it instantly with live rates.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIRS.map(p => (
              <button
                key={`${p.from}-${p.to}`}
                onClick={() => navigate(`/dashboard?q=Convert 1 ${p.from} to ${p.to}`)}
                className="text-left bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-gem-gold/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gem-beige text-sm">{p.from} → {p.to}</div>
                    <div className="text-xs text-gem-beige/40 mt-0.5">{p.name}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gem-beige/20 group-hover:text-gem-gold transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Currency Pair Dropdown Selector */}
        <section className="mb-12 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-6">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-2">Currency Pair Converter Pages</h2>
          <p className="text-gem-beige/60 mb-6 text-sm">
            Select a dedicated guide for popular international currency pairs to view live rates, trend charts, and remote worker invoicing tips.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-xl">
            <div className="relative w-full">
              <select
                value={selectedPair}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPair(val);
                  if (val) {
                    navigate(`/currency/${val}`);
                  }
                }}
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-gem-gold/20 bg-gem-forest text-gem-beige text-sm outline-none focus:border-gem-gold/50 transition-all appearance-none cursor-pointer font-medium"
                data-testid="currency-pair-select"
              >
                <option value="" className="text-gem-mist/50 bg-gem-forest">-- Choose a currency-to-currency guide --</option>
                {ALL_CURRENCY_PAIR_SLUGS.map(slug => {
                  const pair = CURRENCY_PAIRS[slug];
                  const from = CURRENCIES_META[pair.from];
                  const to   = CURRENCIES_META[pair.to];
                  return (
                    <option key={slug} value={slug} className="text-gem-beige bg-gem-forest font-medium">
                      {from.code} to {to.code} Exchange Rate ({from.name} → {to.name})
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gem-gold">
                ▼
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-6">Currency Converter Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["160+ Currencies", "From USD, EUR, GBP to PKR, AED, NGN, BDT, KWD and 150+ more worldwide currencies."],
              ["Live Exchange Rates", "Rates updated daily from ExchangeRate-API using global forex market data."],
              ["7-Day Trend Chart", "See whether a currency is strengthening or weakening over the last 7 trading days."],
              ["AI Natural Language", 'Just type "convert 500 dollars to euros" — the AI handles the rest automatically.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-gem-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gem-beige text-sm mb-0.5">{title}</h3>
                  <p className="text-sm text-gem-beige/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-5">
                <h3 className="font-semibold text-gem-beige mb-2">{f.q}</h3>
                <p className="text-sm text-gem-beige/60 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial — How Exchange Rates Work */}
        <section className="mb-12 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-5">The Real Cost of Getting Paid in a Foreign Currency</h2>
          <div className="space-y-4 text-gem-beige/70 text-[15px] leading-relaxed">
            <p>
              If you've ever landed a lucrative freelance contract with a foreign client, you know the exact feeling: you calculate your massive payout in your head, wait weeks for the wire transfer to clear, and then stare at your bank account wondering where the rest of your money went. Welcome to the brutal reality of exchange rates, hidden banking fees, and currency volatility. We built this tool so you can actually see what your money is worth <em>before</em> the banks take their cut.
            </p>
            <p>
              <strong className="text-gem-beige">The "Mid-Market" Myth.</strong> When you Google "1000 USD to EUR," or when you check the live rate on our dashboard, you are seeing what is known as the "mid-market" or "interbank" rate. This is the wholesale price that massive financial institutions use to trade billions of dollars with each other. The harsh truth? You, as an individual freelancer or small business, are never going to get that exact rate. Traditional banks usually mark up the exchange rate by 3% to 5% and then slap a "wire receiving fee" on top of it to guarantee their profit. By knowing the true mid-market rate, you can accurately calculate exactly how much margin your bank or payment processor is skimming off the top.
            </p>
            <p>
              <strong className="text-gem-beige">Who takes the currency risk?</strong> When you agree to a $5,000/month retainer with a US client, but your rent, taxes, and groceries are paid in British Pounds, Euros, or Indian Rupees, you are taking on 100% of the currency risk. If the US dollar drops 5% in value next month against your local currency, you effectively just took a 5% pay cut, even though you are doing the exact same amount of work. It is a frustrating reality of global freelancing. The best way to protect yourself is to add a 3% to 5% buffer to your international rates during the negotiation phase to absorb those inevitable fluctuations.
            </p>
            <p>
              <strong className="text-gem-beige">Stop driving yourself crazy staring at charts.</strong> Because currency markets operate 24 hours a day, 5 days a week, it is incredibly tempting to look at our 7-day trend chart and try to "time the market" so you can withdraw your cash at the exact moment your currency peaks. Don't do it. Unless you are moving millions of dollars, the stress of day-trading your own salary is not worth the few extra dollars you might squeeze out. Pick a specific day of the month—say, the 1st or the 15th—and just routinely convert your funds then. By converting at regular intervals, you practice "dollar-cost averaging," which evens out the peaks and valleys over the long run.
            </p>
            <p>
              <strong className="text-gem-beige">The Deceptive "Zero Fee" Transfer Services.</strong> You will often see money transfer services advertise "Zero Transfer Fees!" Be incredibly skeptical of this claim. While they might not charge a flat $15 wire fee, they make their money back by offering you an exchange rate that is significantly worse than the mid-market rate. For example, if the true mid-market rate for USD to INR is 83.50, a "zero fee" service might only offer you 81.00. On a $1,000 transfer, that "free" service just cost you 2,500 Rupees. Always compare their offered rate against the live rate on GlobalSync AI to calculate the true cost of the transaction.
            </p>
            <p>
              <strong className="text-gem-beige">Invoicing Strategies for Global Teams.</strong> Should you invoice in your client's currency or your own? Generally, clients prefer to pay in their native currency because it is easier for their accounting departments. If you force a US client to pay an invoice listed in Euros, their bank will hit them with an unexpected conversion fee, which creates friction. The most professional approach is to invoice in the client's currency, but clearly state in your contract that rates are subject to review every 6 months to account for extreme currency fluctuations. This protects you in the event of a market crash without creating monthly accounting headaches.
            </p>
            <p>
              <strong className="text-gem-beige">Leveraging Multi-Currency Accounts.</strong> If you work with clients across different countries, opening a multi-currency account (like Wise or Payoneer) is essential. These accounts allow you to receive payments in local currencies (e.g., getting paid in GBP by a UK client, and USD by an American client) and hold the funds without being forced to immediately convert them. You can then wait for a favorable exchange rate, or even use those held funds to pay international contractors or software subscriptions without ever incurring a conversion fee.
            </p>
            <p>
              <strong className="text-gem-beige">Navigating High-Inflation Currencies.</strong> For freelancers operating in countries experiencing high inflation or rapid currency devaluation (such as Argentina, Turkey, or Pakistan), earning in a stable foreign currency like USD or EUR is a massive financial advantage. However, holding large amounts of local currency becomes a liability. The strategy here is to hold your earnings in the stable foreign currency within a digital wallet, and only convert exact amounts to your local currency as needed to cover immediate living expenses.
            </p>
            <p>
              Global commerce shouldn't mean losing a chunk of your hard-earned money to opaque financial institutions. By equipping yourself with real-time, accurate exchange rate data and adopting smart invoicing and transfer strategies, you can take control of your international income and ensure you are compensated fairly for the value you provide on a global scale.
            </p>
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Popular Pairs Links */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">Popular Currency Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/currency/usd-to-inr", label: "Convert USD to INR with Live Rates", desc: "US Dollar to Indian Rupee" },
              { to: "/currency/usd-to-eur", label: "Convert USD to EUR with Live Rates", desc: "US Dollar to Euro" },
              { to: "/currency/gbp-to-inr", label: "Convert GBP to INR with Live Rates", desc: "British Pound to Indian Rupee" },
              { to: "/currency/usd-to-ngn", label: "Convert USD to NGN with Live Rates", desc: "US Dollar to Nigerian Naira" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-gem-gold/50 transition-all group">
                <div className="font-semibold text-gem-beige text-sm mb-1 group-hover:text-gem-gold transition-colors leading-tight">{link.label}</div>
                <div className="text-xs text-gem-beige/40">{link.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">Freelancer and transparency resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/freelancer-rate-converter" className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-gem-gold/50 transition-all group">
              <div className="font-semibold text-gem-beige text-sm mb-1 group-hover:text-gem-gold transition-colors">Freelancer Rate Converter</div>
              <div className="text-xs text-gem-beige/40">Turn live rates into practical pricing decisions</div>
            </Link>
            <Link to="/data-sources" className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-gem-gold/50 transition-all group">
              <div className="font-semibold text-gem-beige text-sm mb-1 group-hover:text-gem-gold transition-colors">Data Sources</div>
              <div className="text-xs text-gem-beige/40">See where exchange-rate data comes from</div>
            </Link>
            <Link to="/methodology" className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-gem-gold/50 transition-all group">
              <div className="font-semibold text-gem-beige text-sm mb-1 group-hover:text-gem-gold transition-colors">Methodology</div>
              <div className="text-xs text-gem-beige/40">Understand limitations, updates, and disclaimers</div>
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-gem-pine/30 rounded-2xl border border-gem-gold/20 p-6">
          <h2 className="font-heading text-lg font-bold text-gem-beige mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-white/5 backdrop-blur-xl rounded-[28px] p-4 border border-white/10 hover:border-gem-gold/50 transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-gem-gold bg-gem-gold/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-gem-beige text-sm">Free World Time Zone Converter</div>
                <div className="text-xs text-gem-beige/50">Live clocks for 25+ cities, updated every second</div>
              </div>
            </Link>
            <Link to="/freelancer-rate-converter" className="bg-white/5 backdrop-blur-xl rounded-[28px] p-4 border border-white/10 hover:border-gem-gold/50 transition-all flex items-center gap-3">
              <TrendingUp className="w-9 h-9 text-gem-gold bg-gem-gold/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-gem-beige text-sm">Freelancer Rate Converter</div>
                <div className="text-xs text-gem-beige/50">Convert rates for global clients</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
