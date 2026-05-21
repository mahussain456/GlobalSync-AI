import { Link } from "react-router-dom";
import { FileText, Edit3, RefreshCw, AlertCircle, Mail } from "lucide-react";
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
            backgroundImage: "url('/world-map-bg.png')", 
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
            Editorial Policy
          </h1>
          <p className="text-gem-beige/60 text-lg leading-relaxed">
            GlobalSync AI is committed to producing accurate, useful, and transparent content about time zones, currency conversion, and remote work. This page explains how we create and maintain that content.
          </p>
          <p className="text-xs text-gem-beige/40 mt-4">Last updated: April 2026</p>
        </header>

        <Section icon={Edit3} title="How We Create Content">
          <p>
            Content published on GlobalSync AI — including blog posts, tool descriptions, city-pair pages, and currency-pair pages — is produced by Ahmed Hussain with editorial review against product behavior, public source material, and data-provider documentation.
          </p>
          <p>
            We do not accept sponsored articles, paid placements, or "native advertising" that is presented as editorial content. Advertising on GlobalSync AI (such as Google AdSense display ads) is clearly separated from editorial content and does not influence what we write or how we write it.
          </p>
          <p>
            All content is written to inform users — not to serve advertiser interests. If we reference a third-party product or service, it should be because it is relevant to the reader task, not because of a hidden commercial arrangement.
          </p>
        </Section>

        <Section icon={FileText} title="Sources We Use">
          <p>Our content draws on the following primary sources:</p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li><strong className="text-gem-beige">Time zone data:</strong> The IANA Time Zone Database (TZDB), the authoritative global standard for time zone and daylight saving time rules used by operating systems worldwide.</li>
            <li><strong className="text-gem-beige">Currency exchange rates:</strong> Live rate data sourced via our backend from established financial data providers, reflecting real-time mid-market rates.</li>
            <li><strong className="text-gem-beige">Remote work statistics:</strong> Published research from organizations such as Buffer, Gallup, the International Labour Organization, and reputable industry analysts. We cite our sources in context where appropriate.</li>
            <li><strong className="text-gem-beige">AI-generated content:</strong> Some tool responses are generated by AI (see our <Link to="/methodology" className="text-gem-gold hover:text-gem-gold/80 underline">Methodology</Link> page). AI-generated content is reviewed for accuracy before publication where it appears in static editorial copy.</li>
          </ul>
        </Section>

        <Section icon={RefreshCw} title="How We Update Content">
          <p>
            We review and update our content on the following schedules:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li><strong className="text-gem-beige">Currency rates:</strong> Fetched live from our backend in real time. No manual update required — rates reflect the current market automatically.</li>
            <li><strong className="text-gem-beige">Time zone rules:</strong> Updated when the IANA TZDB releases a new version, typically multiple times per year ahead of DST transitions.</li>
            <li><strong className="text-gem-beige">Blog articles:</strong> Reviewed and refreshed annually or when significant changes occur in the subject matter (e.g., new remote work regulations, major currency policy changes).</li>
            <li><strong className="text-gem-beige">City and currency pair pages:</strong> Editorial content on these pages is reviewed and updated at least annually.</li>
          </ul>
          <p className="mt-3">
            When we make material updates to a piece of content, we update the "last modified" date on the page.
          </p>
        </Section>

        <Section icon={AlertCircle} title="Corrections Policy">
          <p>
            We take accuracy seriously. If you identify an error in any of our content — whether factual, typographical, or technical — please contact us immediately. We commit to:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>Acknowledging factual corrections within 2 business days</li>
            <li>Publishing corrections prominently on the affected page</li>
            <li>Not altering historical content silently — significant corrections are noted inline</li>
          </ul>
        </Section>

        <Section icon={Mail} title="Contact Our Editorial Team">
          <p>
            For editorial inquiries, corrections, or feedback on our content, please use our{" "}
            <Link to="/contact" className="text-gem-gold hover:text-gem-gold/80 underline">
              contact form
            </Link>{" "}
            or email us directly. We read every message.
          </p>
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
