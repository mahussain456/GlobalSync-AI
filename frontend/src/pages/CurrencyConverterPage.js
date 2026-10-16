import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import CurrencyConverter from "@/components/CurrencyConverter";
import { ToolHero, ToolSection, BrowseAll, LinkList, ToolFaq, RelatedTools } from "@/components/tool/ToolPage";
import { CURRENCIES_META, CURRENCY_PAIRS, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";
import { getCurrencyHubSEO } from "@/lib/seo";

const PAIRS = [
  ["USD", "EUR", "US Dollar to Euro"],
  ["USD", "INR", "US Dollar to Indian Rupee"],
  ["USD", "GBP", "US Dollar to British Pound"],
  ["USD", "PKR", "US Dollar to Pakistani Rupee"],
  ["USD", "AED", "US Dollar to UAE Dirham"],
  ["EUR", "GBP", "Euro to British Pound"],
  ["GBP", "INR", "British Pound to Indian Rupee"],
  ["USD", "PHP", "US Dollar to Philippine Peso"],
  ["USD", "NGN", "US Dollar to Nigerian Naira"],
].map(([from, to, name]) => ({ to: `/currency/${from.toLowerCase()}-to-${to.toLowerCase()}`, label: `${from} to ${to}`, desc: name }));

const READ = [
  ["Check the time", "Rates refresh every minute. The time beside your result says when it was taken; a cached result is labelled as a saved snapshot."],
  ["It’s the mid-market rate", "The midpoint between buy and sell prices. Banks and transfer services add a margin and fees, so you’ll receive a little less."],
  ["Get the final quote from your provider", "GlobalSync doesn’t move money. Your payment provider sets the actual rate and fees."],
  ["Copy with context", "Copying a result includes its source and time, so the estimate travels with its caveats."],
];

const FAQ = [
  { q: "How often are the exchange rates updated?", a: "Every minute. The converter uses live market rates and checks each one against ExchangeRate-API daily reference rates. Each result shows its source and the time it was taken. If the live feed is unavailable, the daily reference rate is shown with its date, and an offline snapshot is labeled as cached." },
  { q: "What is the mid-market exchange rate?", a: "The mid-market rate is the midpoint between buy and sell prices. Our reference estimate is not a transfer quote: your payment provider determines the rate, fees and final amount received." },
  { q: "How many currencies do you support?", a: "Over 160 currencies, including USD, EUR, GBP, INR, PKR and NGN, covering almost every circulating currency." },
  { q: "Are there any hidden fees for using the currency converter?", a: "No. The converter is free. We don't take a cut and don't charge any subscription or conversion fees." },
];

const PAIR_OPTIONS = ALL_CURRENCY_PAIR_SLUGS.map((slug) => {
  const pair = CURRENCY_PAIRS[slug];
  const from = CURRENCIES_META[pair.from], to = CURRENCIES_META[pair.to];
  return from && to ? { value: slug, label: `${from.code} to ${to.code} (${from.name} to ${to.name})`, href: `/currency/${slug}` } : null;
}).filter(Boolean);

export default function CurrencyConverterPage() {
  const seo = getCurrencyHubSEO({ faqs: FAQ });
  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />
      <SiteNav />

      <ToolHero
        title="Currency Converter"
        intro="Convert 160+ currencies at live mid-market rates, refreshed every minute and cross-checked before they reach you. Every result shows its source and time."
      >
        <CurrencyConverter />
      </ToolHero>

      <div className="tool-shell tool-body">
        <AdBanner slot="leaderboard" className="mb-8" />

        <ToolSection id="fx-popular" title="Popular currency pairs" intro="Each pair has its own page with the live rate and quick conversions.">
          <LinkList links={PAIRS} />
          <BrowseAll label="Find any currency pair" placeholder="Type a code or name, e.g. PKR" options={PAIR_OPTIONS} testId="currency-pair-search" />
        </ToolSection>

        <ToolSection id="fx-read" title="How to read your result">
          <ol className="tool-steps">
            {READ.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ol>
        </ToolSection>

        <ToolFaq faqs={FAQ} id="fx-faq" />

        <AdBanner slot="rectangle" className="mb-8" />

        <RelatedTools links={[
          { to: "/freelancer-rate-converter", label: "Freelance rate calculator" },
          { to: "/invoice", label: "Invoice builder" },
          { to: "/freelance-rate", label: "Rate corridors" },
          { to: "/data-sources", label: "Data sources" },
          { to: "/guides/invoicing-international-clients-currency-guide", label: "Invoicing guide" },
        ]} />
      </div>
      <SiteFooter />
    </div>
  );
}
