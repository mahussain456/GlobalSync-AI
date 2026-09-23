import { Link } from "react-router-dom";
import { Clock, DollarSign, Cpu, RefreshCw, AlertTriangle, Binary, Shield } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const Section = ({ icon: Icon, color = "blue", title, children }) => {
  const colors = {
    blue:    "bg-wash border-line text-pine",
    emerald: "bg-wash border-line text-pine",
    violet:  "bg-wash border-line text-pine",
    orange:  "bg-gem-gold/10 border-line text-pine",
    red:     "bg-red-950/20 border-red-800/20 text-red-800",
  };
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <h2 className="font-heading text-xl font-bold text-ink">{title}</h2>
      </div>
      <div className="pl-12 space-y-4 text-quiet text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="flex items-start gap-3 bg-surface  rounded-xl border border-line p-4">
    <div className="text-xs font-semibold text-quiet uppercase tracking-wide mt-0.5 w-28 shrink-0">{label}</div>
    <div className="text-sm text-quiet">{value}</div>
  </div>
);

export default function MethodologyPage() {
  const seo = getStaticPageSEO("methodology");
  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-quiet mb-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-quiet">Home</Link>
          <span>/</span>
          <span className="text-quiet">Methodology</span>
        </nav>

        {/* Header */}
        <header className="mb-12"><h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-4">
            GlobalSync AI: Our Data Sources and Methodology
          </h1>
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-pine rounded-full px-3 py-1 text-xs font-medium mb-4 border border-line">
            <Cpu className="w-3.5 h-3.5" /> Data & AI Transparency
          </div>

          <p className="text-quiet text-lg leading-relaxed">
            Transparency matters. This page explains exactly where GlobalSync AI gets its data, how our AI assistant generates answers, what our update frequencies are, and what limitations users should understand.
          </p>
          <p className="text-xs text-quiet mt-4">Last updated: April 2026</p>
        </header>

        {/* Quick reference */}
        <div className="mb-12 bg-surface  rounded-xl border border-line p-6">
          <h2 className="font-heading text-base font-bold text-ink mb-4">Data Sources and Methodology Overview</h2>
          <div className="space-y-3">
            <InfoCard label="Time Zones" value="IANA Time Zone Database (TZDB) — the global standard used by all major operating systems" />
            <InfoCard label="Exchange Rates" value="Timestamped ExchangeRate-API snapshots shared across conversion tools" />
            <InfoCard label="AI Engine" value="Anthropic Claude (claude-3-5-sonnet) — used for natural language queries in the AI assistant" />
            <InfoCard label="Rate Updates" value="Currency rates: real-time on every query. Time zone rules: on every IANA TZDB release." />
          </div>
        </div>

        <Section icon={Clock} color="blue" title="Time Zone Data">
          <p>
            All time zone conversions on GlobalSync AI use the{" "}
            <strong className="text-ink">IANA Time Zone Database</strong> (also called the Olson database or tzdata), the globally authoritative source for time zone and daylight saving time rules. It is maintained by a team of volunteer experts and is used by virtually every operating system, programming language, and device worldwide.
          </p>
          <p>
            The IANA TZDB is updated multiple times per year — often just weeks before a DST transition — to reflect decisions by governments that change their clock rules. GlobalSync AI updates its time zone logic whenever a new TZDB version is released.
          </p>
          <p>
            <strong className="text-ink">Daylight Saving Time (DST):</strong> Our converters account for DST rules for all cities that observe them. Because DST dates vary by country and change year to year, we display DST status on relevant city-pair pages to help users understand seasonal gaps. Users should always verify with a live tool — including ours — rather than relying on memorized offsets.
          </p>
          <p>
            <strong className="text-ink">What we don't cover:</strong> Real-time DST announcements made by governments after our last TZDB update. In rare cases where a government changes its DST rules with very short notice (which does happen), our data may lag until the next TZDB release.
          </p>
        </Section>

        <Section icon={DollarSign} color="emerald" title="Currency Exchange Rates">
          <p>
            Live exchange rates displayed on GlobalSync AI are fetched in real time from our backend, which aggregates data from the{" "}
            <strong className="text-ink">ExchangeRate-API</strong> reference snapshots. These estimates are not executable transfer quotes.
          </p>
          <p>
            <strong className="text-ink">Rate type:</strong> We display the <em>mid-market rate</em> — the midpoint between the buy and sell rates used in interbank trading. This is the most accurate benchmark for the true value of a currency pair. It is not the rate you will receive from a bank, payment app, or money transfer service, which will apply their own margin on top.
          </p>
          <p>
            <strong className="text-ink">Update frequency:</strong> Converters share an ExchangeRate-API reference snapshot, cached for up to one hour in your browser. The provider update timestamp is shown with each result. When the provider is unavailable, a dated build snapshot is explicitly labeled cached. Reference rates are not executable transfer quotes.
          </p>
          <p>
            <strong className="text-ink">Coverage:</strong> Our converter supports 160+ currencies including major, minor, and emerging market currencies. Exotic or illiquid currency pairs may have less precise rate data than major pairs (e.g., USD/EUR, GBP/INR).
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
            <p className="text-amber-800 font-medium text-sm">
              ⚠️ Important: Exchange rates are for informational purposes only. They are not financial advice and should not be used as the sole basis for financial, investment, or business decisions. Always verify rates with your bank or financial institution before executing any transaction.
            </p>
          </div>
        </Section>

        <Section icon={Cpu} color="violet" title="AI-Generated Answers">
          <p>
            GlobalSync AI's natural language assistant is powered by{" "}
            <strong className="text-ink">Anthropic Claude (claude-3-5-sonnet)</strong>, a large language model developed by Anthropic. When you ask a question in natural language — such as "What time is 3 PM New York in Tokyo?" or "Convert 500 USD to INR" — the AI processes your query and generates a response.
          </p>
          <p>
            <strong className="text-ink">How it works:</strong> The AI receives your query along with current time zone and exchange rate context from our backend, and generates a natural language answer. For simple conversions, the answer is computed directly from live data. For more complex questions, the AI uses its training knowledge to provide context and guidance.
          </p>
          <p>
            <strong className="text-ink">Limitations you must understand:</strong>
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>AI responses can occasionally be inaccurate, especially for edge cases involving unusual time zones, newly changed DST rules, or complex multi-currency scenarios.</li>
            <li>AI answers are generated per query and are not reviewed by our editorial team before display. Always cross-check important answers with our dedicated converter tools or a trusted external source.</li>
            <li>The AI assistant has a knowledge cutoff date and may not be aware of very recent changes to currency policies, government regulations, or DST rule changes.</li>
            <li>AI responses are informational only and do not constitute financial, legal, or professional advice of any kind.</li>
          </ul>
        </Section>

        <Section icon={Binary} color="blue" title="Decimal Precision, Rounding Rules, and System Reliability">
          <p>
            To prevent compounding arithmetic errors during complex multi-currency conversions, all monetary calculations are processed using double-precision floating-point numbers before formatting for visual presentation. Standard currency values are rounded to exactly four decimal places in our backend feeds and truncated to two decimal places in the user interface for standard operations.
          </p>
          <p>
            Time zone math operates on absolute minute-level offsets (e.g., UTC+3:30 for Iran Standard Time) rather than simple decimal hours, preventing errors when coordinating meetings. System health is audited every minute to ensure timezone mapping synchrony.
          </p>
          <p>
            Our core processing pipelines are designed with extensive retry mechanics, failing over automatically to backup institutional servers if primary API gateways face transient connectivity dropouts. This redundancy guarantees high availability, ensuring that teams rely on active clocks even during high-traffic intervals.
          </p>
        </Section>

        <Section icon={Shield} color="emerald" title="AI Integration & Large Language Model Parameter Safeguards">
          <p>
            GlobalSync AI incorporates state-of-the-art large language models to resolve user questions phrased in casual, conversational dialogue. To secure absolute mathematical consistency, all natural-language prompts are parsed, and numerical values are sent through our dedicated logic APIs. The AI is restricted from performing complex timezone offset arithmetic or currency multiplication inside its own neural parameters.
          </p>
          <p>
            Instead, the model acts as an intelligent translator, identifying the user's intent (e.g., "Schedule a meeting with Karachi"), querying our backend servers for standard UTC offsets and exchange index ratios, and inserting the exact real-time values back into the final conversational response. This keeps responses accurate and prevents hallucination.
          </p>
        </Section>

        <Section icon={RefreshCw} color="orange" title="Update Frequency Summary">
          <div className="space-y-3">
            <InfoCard label="Currency rates" value="Real-time — fetched live on every converter page load or AI query" />
            <InfoCard label="Time zone rules" value="Updated on each IANA TZDB release, typically 3–6 times per year" />
            <InfoCard label="7-day rate trend" value="Historical rate data refreshed daily from ECB reference data" />
            <InfoCard label="AI model" value="Anthropic Claude; model version updated periodically as newer versions become available" />
            <InfoCard label="Blog content" value="Reviewed and refreshed annually or when material changes occur in the subject matter" />
            <InfoCard label="City/currency pair pages" value="Editorial content reviewed at least annually; live data (clocks/rates) is always real-time" />
          </div>
        </Section>

        <Section icon={AlertTriangle} color="red" title="Disclaimer">
          <p>
            All content and tools on GlobalSync AI are provided for <strong className="text-ink">informational purposes only</strong>. We do not guarantee the accuracy, completeness, or timeliness of any data, and we are not liable for any decisions made based on information obtained from this site.
          </p>
          <p>
            For time-sensitive financial transactions, legal matters, or professional decisions, always verify information independently with qualified professionals or official sources.
          </p>
          <p>
            For the full legal terms of use, see our{" "}
            <Link to="/terms-of-service" className="text-pine hover:text-pine underline">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-pine hover:text-pine underline">Privacy Policy</Link>.
          </p>
        </Section>

        {/* Related links */}
        <div className="mt-4 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/editorial-policy" className="bg-surface  rounded-xl border border-line p-5 hover:border-line hover:bg-surface transition-all group">
            <div className="font-semibold text-ink group-hover:text-pine transition-colors mb-1">Editorial Policy →</div>
            <div className="text-sm text-quiet">How our content is written, reviewed, and corrected</div>
          </Link>
          <Link to="/about" className="bg-surface  rounded-xl border border-line p-5 hover:border-line hover:bg-surface transition-all group">
            <div className="font-semibold text-ink group-hover:text-pine transition-colors mb-1">About GlobalSync AI →</div>
            <div className="text-sm text-quiet">Our mission, tools, and the team behind the platform</div>
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
