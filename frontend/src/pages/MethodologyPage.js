import { Link } from "react-router-dom";
import { Clock, DollarSign, Cpu, RefreshCw, AlertTriangle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const Section = ({ icon: Icon, color = "blue", title, children }) => {
  const colors = {
    blue:    "bg-blue-900/20 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-900/20 border-emerald-500/20 text-emerald-400",
    violet:  "bg-violet-900/20 border-violet-500/20 text-violet-400",
    orange:  "bg-orange-900/20 border-orange-500/20 text-orange-400",
    red:     "bg-red-900/20 border-red-500/20 text-red-400",
  };
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <h2 className="font-heading text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="pl-12 space-y-4 text-white/70 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="flex items-start gap-3 bg-[#0A0F1E] border border-white/10 rounded-xl p-4">
    <div className="text-xs font-semibold text-white/40 uppercase tracking-wide mt-0.5 w-28 shrink-0">{label}</div>
    <div className="text-sm text-white/80">{value}</div>
  </div>
);

export default function MethodologyPage() {
  const seo = getStaticPageSEO("methodology");
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-white/40 mb-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-white/80">Home</Link>
          <span>/</span>
          <span className="text-white/80">Methodology</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-400 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-violet-500/30">
            <Cpu className="w-3.5 h-3.5" /> Data & AI Transparency
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Our Methodology
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Transparency matters. This page explains exactly where GlobalSync AI gets its data, how our AI assistant generates answers, what our update frequencies are, and what limitations users should understand.
          </p>
          <p className="text-xs text-white/40 mt-4">Last updated: April 2026</p>
        </header>

        {/* Quick reference */}
        <div className="mb-12 bg-[#0A0F1E] rounded-2xl border border-white/10 p-6">
          <h2 className="font-heading text-base font-bold text-white mb-4">Quick Reference</h2>
          <div className="space-y-3">
            <InfoCard label="Time Zones" value="IANA Time Zone Database (TZDB) — the global standard used by all major operating systems" />
            <InfoCard label="Exchange Rates" value="Live market rates via European Central Bank (ECB) and supplementary providers, fetched in real time" />
            <InfoCard label="AI Engine" value="Anthropic Claude (claude-3-5-sonnet) — used for natural language queries in the AI assistant" />
            <InfoCard label="Rate Updates" value="Currency rates: real-time on every query. Time zone rules: on every IANA TZDB release." />
          </div>
        </div>

        <Section icon={Clock} color="blue" title="Time Zone Data">
          <p>
            All time zone conversions on GlobalSync AI use the{" "}
            <strong className="text-white">IANA Time Zone Database</strong> (also called the Olson database or tzdata), the globally authoritative source for time zone and daylight saving time rules. It is maintained by a team of volunteer experts and is used by virtually every operating system, programming language, and device worldwide.
          </p>
          <p>
            The IANA TZDB is updated multiple times per year — often just weeks before a DST transition — to reflect decisions by governments that change their clock rules. GlobalSync AI updates its time zone logic whenever a new TZDB version is released.
          </p>
          <p>
            <strong className="text-white">Daylight Saving Time (DST):</strong> Our converters account for DST rules for all cities that observe them. Because DST dates vary by country and change year to year, we display DST status on relevant city-pair pages to help users understand seasonal gaps. Users should always verify with a live tool — including ours — rather than relying on memorized offsets.
          </p>
          <p>
            <strong className="text-white">What we don't cover:</strong> Real-time DST announcements made by governments after our last TZDB update. In rare cases where a government changes its DST rules with very short notice (which does happen), our data may lag until the next TZDB release.
          </p>
        </Section>

        <Section icon={DollarSign} color="emerald" title="Currency Exchange Rates">
          <p>
            Live exchange rates displayed on GlobalSync AI are fetched in real time from our backend, which aggregates data from the{" "}
            <strong className="text-white">European Central Bank (ECB)</strong> reference rates and supplementary market data providers.
          </p>
          <p>
            <strong className="text-white">Rate type:</strong> We display the <em>mid-market rate</em> — the midpoint between the buy and sell rates used in interbank trading. This is the most accurate benchmark for the true value of a currency pair. It is not the rate you will receive from a bank, payment app, or money transfer service, which will apply their own margin on top.
          </p>
          <p>
            <strong className="text-white">Update frequency:</strong> Rates are fetched live on each query from the currency converter or currency pair pages. There is no cached "daily rate" — each page load requests the current market rate.
          </p>
          <p>
            <strong className="text-white">Coverage:</strong> Our converter supports 160+ currencies including major, minor, and emerging market currencies. Exotic or illiquid currency pairs may have less precise rate data than major pairs (e.g., USD/EUR, GBP/INR).
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
            <p className="text-amber-400 font-medium text-sm">
              ⚠️ Important: Exchange rates are for informational purposes only. They are not financial advice and should not be used as the sole basis for financial, investment, or business decisions. Always verify rates with your bank or financial institution before executing any transaction.
            </p>
          </div>
        </Section>

        <Section icon={Cpu} color="violet" title="AI-Generated Answers">
          <p>
            GlobalSync AI's natural language assistant is powered by{" "}
            <strong className="text-white">Anthropic Claude (claude-3-5-sonnet)</strong>, a large language model developed by Anthropic. When you ask a question in natural language — such as "What time is 3 PM New York in Tokyo?" or "Convert 500 USD to INR" — the AI processes your query and generates a response.
          </p>
          <p>
            <strong className="text-white">How it works:</strong> The AI receives your query along with current time zone and exchange rate context from our backend, and generates a natural language answer. For simple conversions, the answer is computed directly from live data. For more complex questions, the AI uses its training knowledge to provide context and guidance.
          </p>
          <p>
            <strong className="text-white">Limitations you must understand:</strong>
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>AI responses can occasionally be inaccurate, especially for edge cases involving unusual time zones, newly changed DST rules, or complex multi-currency scenarios.</li>
            <li>AI answers are generated per query and are not reviewed by our editorial team before display. Always cross-check important answers with our dedicated converter tools or a trusted external source.</li>
            <li>The AI assistant has a knowledge cutoff date and may not be aware of very recent changes to currency policies, government regulations, or DST rule changes.</li>
            <li>AI responses are informational only and do not constitute financial, legal, or professional advice of any kind.</li>
          </ul>
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
            All content and tools on GlobalSync AI are provided for <strong className="text-white">informational purposes only</strong>. We do not guarantee the accuracy, completeness, or timeliness of any data, and we are not liable for any decisions made based on information obtained from this site.
          </p>
          <p>
            For time-sensitive financial transactions, legal matters, or professional decisions, always verify information independently with qualified professionals or official sources.
          </p>
          <p>
            For the full legal terms of use, see our{" "}
            <Link to="/terms-of-service" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link>.
          </p>
        </Section>

        {/* Related links */}
        <div className="mt-4 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/editorial-policy" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-5 hover:border-white/20 hover:bg-white/5 transition-all group">
            <div className="font-semibold text-white group-hover:text-violet-400 transition-colors mb-1">Editorial Policy →</div>
            <div className="text-sm text-white/60">How our content is written, reviewed, and corrected</div>
          </Link>
          <Link to="/about" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-5 hover:border-white/20 hover:bg-white/5 transition-all group">
            <div className="font-semibold text-white group-hover:text-violet-400 transition-colors mb-1">About GlobalSync AI →</div>
            <div className="text-sm text-white/60">Our mission, tools, and the team behind the platform</div>
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
