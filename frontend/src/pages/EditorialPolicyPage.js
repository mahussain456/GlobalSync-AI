import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

// Plain, specific and true. Every claim here should match how the tools work today;
// if a data source or process changes, change this page in the same commit.

const Section = ({ id, title, children }) => (
  <section className="mb-10" aria-labelledby={id}>
    <h2 id={id} className="font-heading text-2xl font-bold text-ink mb-4">{title}</h2>
    <div className="space-y-3 text-quiet text-base leading-relaxed">{children}</div>
  </section>
);

const A = ({ to, children }) => <Link to={to} className="text-pine underline underline-offset-4">{children}</Link>;

export default function EditorialPolicyPage() {
  const seo = getStaticPageSEO("editorial-policy");
  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />
      <SiteNav />

      <main>
        <article className="max-w-3xl mx-auto px-6 pt-16 pb-12">
          <nav className="text-xs text-quiet mb-8 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span>Editorial Policy</span>
          </nav>

          <header className="mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-4">
              GlobalSync AI: Our Editorial Standards and Accuracy Policy
            </h1>
            <p className="text-quiet text-lg leading-relaxed">
              GlobalSync AI makes free tools for people who work across time zones and currencies: a time zone converter, a meeting
              planner, a currency converter, a freelance rate calculator and an invoice builder, plus guides on using them. This page
              explains where our numbers come from, who writes the guides, what we refuse to publish, and how to get something fixed.
            </p>
            <p className="text-xs text-quiet mt-4">Last updated: October 2026</p>
          </header>

          <Section id="numbers" title="Where the numbers come from">
            <p>
              <strong className="text-ink">Time zones.</strong> Every conversion uses the IANA time zone database through your
              browser's built-in time zone support, the same rules your operating system uses. Daylight saving changes are applied
              on each region's official dates. Live clocks are synced to our server clock, so a wrong device clock doesn't skew them.
              Keep your browser and operating system updated and the rules stay current.
            </p>
            <p>
              <strong className="text-ink">Exchange rates.</strong> Rates come from a live market feed (Coinbase's public rate feed),
              refreshed every minute. Each live rate is checked against the ExchangeRate-API daily reference rate. If the two differ
              by more than 3%, we show the reference rate instead. Every result shows its source and the time it was taken. If both
              feeds are down, you get a dated snapshot that is labeled as one.
            </p>
            <p>
              These are mid-market rates: the midpoint between buying and selling prices. Banks and transfer services add a margin
              and fees, so the amount you receive will be lower. We don't move money and we don't quote transfers.
            </p>
            <p>
              The full list of providers is on the <A to="/data-sources">Data Sources</A> page. How each calculation works, and its
              limits, is on the <A to="/methodology">Methodology</A> page.
            </p>
          </Section>

          <Section id="guides" title="How guides are written and checked">
            <p>
              Guides are written by Ahmed Hussain, who builds GlobalSync AI. AI tools help with outlines and copy editing. They don't
              do the maths: every time and rate in a guide is calculated by the same code that runs the tools.
            </p>
            <p>
              Times and exchange rates inside guides are filled in live when you open the page. When a guide tells you what 9:00 AM in
              New York is in Manila, that answer is worked out for the current week, so it stays right after a daylight saving change. The rates show
              the date they were taken. Nothing is typed in by hand and left to go stale.
            </p>
            <p>
              Tax, payment and labor-law points link to the official source where one exists and say when you should check with an
              accountant or lawyer. Those rules change, and our guides are a starting point, not advice for your situation.
            </p>
          </Section>

          <Section id="never" title="What we won't publish">
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>Invented statistics, user counts, testimonials or reviews.</li>
              <li>Claims about clients or customers we can't back up.</li>
              <li>Hand-typed rates or meeting times that can go out of date.</li>
              <li>Sponsored articles or paid placements presented as editorial.</li>
            </ul>
          </Section>

          <Section id="comparisons" title="Comparisons and our own product">
            <p>
              We don't publish product reviews. Some guides compare our tools with others, such as World Time Buddy and
              timeanddate.com. Those guides rank our own product, and they say so in a disclosure at the top of the page. We have no
              paid placements or affiliate deals with any tool we compare. If that changes, the guide will say so.
            </p>
            <p>
              The site shows ads to stay free. Advertisers have no say in what we write, rank or recommend.
            </p>
          </Section>

          <Section id="corrections" title="Corrections">
            <p>
              Found a wrong time, a bad rate, a broken calculation or an outdated fact? Email{" "}
              <a href="mailto:editorial@globalsync-ai.com" className="text-pine underline underline-offset-4">editorial@globalsync-ai.com</a>{" "}
              or use the <A to="/contact">contact page</A>. Include the page address and what you expected to see. Every report is
              read.
            </p>
            <p>
              When a guide gets a material correction, we update its date and note what changed on the page. Calculation bugs are
              fixed in the tool itself, so every page that uses it is corrected at once.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/methodology" className="bg-surface rounded-xl border border-line p-5 hover:border-pine transition-colors group">
              <div className="font-semibold text-ink group-hover:text-pine transition-colors mb-1">Methodology</div>
              <div className="text-sm text-quiet">How the time zone and currency calculations work, and their limits</div>
            </Link>
            <Link to="/guides" className="bg-surface rounded-xl border border-line p-5 hover:border-pine transition-colors group">
              <div className="font-semibold text-ink group-hover:text-pine transition-colors mb-1">Guides</div>
              <div className="text-sm text-quiet">Meeting times, invoicing and rates for cross-border work</div>
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
