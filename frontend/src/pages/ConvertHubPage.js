import { Link } from "react-router-dom";
import { Clock, ArrowRight, Globe } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { ZONE_PAIRS, getPriorityPairs } from "@/data/zonePairs";

// Group pairs by "from" zone for the hub grid
function groupByFrom(pairs) {
  const groups = {};
  pairs.forEach(p => {
    if (!groups[p.from]) groups[p.from] = [];
    groups[p.from].push(p);
  });
  return groups;
}

const PRIORITY_1 = getPriorityPairs(1);
const PRIORITY_2 = getPriorityPairs(2);
const PRIORITY_3 = getPriorityPairs(3);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time Zone Converters", "item": "https://www.globalsync-ai.com/convert" },
  ],
};

function PairCard({ p }) {
  return (
    <Link
      to={`/convert/${p.slug}`}
      className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gem-gold/30 rounded-xl px-4 py-3.5 transition-all"
      data-testid={`pair-card-${p.slug}`}
    >
      <div className="flex items-center gap-3">
        <Clock className="w-4 h-4 text-gem-sage group-hover:text-gem-gold transition-colors flex-shrink-0" />
        <span className="text-sm font-medium text-gem-beige group-hover:text-gem-gold transition-colors">
          {p.from} to {p.to}
        </span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-gem-sage group-hover:text-gem-gold transition-colors flex-shrink-0" />
    </Link>
  );
}

function PairGroup({ title, pairs, columns = 3 }) {
  return (
    <div className="mb-10">
      <h2 className="font-heading text-lg font-semibold text-gem-beige mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gem-gold inline-block" />
        {title}
      </h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-3`}>
        {pairs.map(p => <PairCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}

export default function ConvertHubPage() {
  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead
        title="Time Zone Converters — EST, IST, PST, GMT, CET and More"
        description="Free instant converters for 40 timezone abbreviation pairs (EST to IST, PST to GMT, CET to EST). Compare 24-hour tables, DST shifts & meeting windows."
        canonical="https://www.globalsync-ai.com/convert"
        schema={[breadcrumbSchema]}
      />

      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <span className="text-gem-mist">Time Zone Converters</span>
        </nav>

        {/* H1 + intro */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <Globe className="w-3.5 h-3.5" /> 40 timezone pairs · Live offsets · DST-aware
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
            Time Zone Converters
          </h1>
          <p className="text-gem-mist text-lg max-w-2xl leading-relaxed">
            Instant converters for the timezone abbreviation pairs most searched by remote teams,
            freelancers, and developers. Each page shows the current offset, a full 24-hour
            conversion table, business-hours overlap, and DST transition dates.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/time-zone-converter"
              className="inline-flex items-center gap-1.5 bg-gem-gold text-gem-forest font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-gem-gold/90 transition-colors"
            >
              <Clock className="w-4 h-4" /> Free Time Zone Converter
            </Link>
            <Link
              to="/meeting-planner"
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/20 text-gem-beige text-sm rounded-xl px-4 py-2.5 hover:bg-white/10 transition-colors"
            >
              Meeting Planner
            </Link>
          </div>
        </header>

        {/* Priority 1 — highest volume */}
        <PairGroup
          title="Most-searched pairs"
          pairs={PRIORITY_1}
          columns={2}
        />

        {/* Priority 2 */}
        <PairGroup
          title="US–Europe and Asia corridors"
          pairs={PRIORITY_2}
          columns={3}
        />

        {/* Priority 3 */}
        <PairGroup
          title="APAC, Middle East, and Americas"
          pairs={PRIORITY_3}
          columns={3}
        />

        {/* Editorial note */}
        <div className="mt-6 bg-white/3 border border-white/8 rounded-2xl p-6 text-sm text-gem-sage leading-relaxed">
          <h2 className="font-heading text-base font-semibold text-gem-beige mb-2">About these converters</h2>
          <p className="mb-2">
            Each page uses live <code className="bg-white/10 rounded px-1 text-xs">Intl.DateTimeFormat</code> to
            compute the current UTC offset for both zones, accounting for today's DST status in each region.
            Conversion tables use standard (non-DST) offsets so they remain stable as reference material.
          </p>
          <p>
            DST transition dates on each page are updated annually. For live world-clock times and
            multi-city meeting scheduling, use the{" "}
            <Link to="/time-zone-converter" className="text-gem-gold hover:underline">
              Time Zone Converter
            </Link>{" "}
            or{" "}
            <Link to="/meeting-planner" className="text-gem-gold hover:underline">
              Meeting Planner
            </Link>.
          </p>
        </div>

      </div>

      <SiteFooter />
    </div>
  );
}
