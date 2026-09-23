import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Users, Globe, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { MEETING_CORRIDORS } from "@/data/meetingCorridors";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.globalsync-ai.com/" },
    { "@type": "ListItem", "position": 2, "name": "Meeting Overlap Guides", "item": "https://www.globalsync-ai.com/meeting-overlap" },
  ],
};

export default function MeetingOverlapHubPage() {
  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead
        rawTitle="Best Meeting Times & Timezone Overlap Guides | GlobalSync AI"
        description="Find the best meeting times between global regions (US, India, UK, Europe, Philippines, Australia). 24-hour overlap heatmaps & team fairness guides."
        canonical="/meeting-overlap"
        keywords="global meeting times, distributed team scheduling, time zone overlap, remote work collaboration, international meeting planner"
        schema={[breadcrumbSchema]}
      />

      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-quiet">Home</Link>
          <span>/</span>
          <span className="text-quiet">Meeting Overlap Guides</span>
        </nav>

        {/* H1 + Intro */}
        <header className="mb-10"><h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-4">
            Best Meeting Times & Overlap Guides
          </h1>
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-pine rounded-full px-3 py-1 text-xs font-medium mb-4 border border-line">
            <Users className="w-3.5 h-3.5" /> 8 Global Region Corridors · Rotation Fairness
          </div>

          <p className="text-quiet text-lg max-w-3xl leading-relaxed">
            Stop guessing cross-border meeting slots. Explore recommended meeting windows, 24-hour schedule heat maps, and rotation-fairness strategies for distributed teams.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/meeting-planner"
              className="inline-flex items-center gap-1.5 bg-pine text-paper font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-ink transition-colors"
            >
              <Calendar className="w-4 h-4" /> Open Meeting Planner
            </Link>
            <Link
              to="/time-zone-converter"
              className="inline-flex items-center gap-1.5 bg-surface border border-line text-ink text-sm rounded-xl px-4 py-2.5 hover:bg-surface transition-colors"
            >
              Time Zone Converter
            </Link>
          </div>
        </header>

        {/* Corridor Grid */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-ink mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-pine" />
            Popular Meeting Corridors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEETING_CORRIDORS.map(c => (
              <Link
                key={c.slug}
                to={`/meeting-overlap/${c.slug}`}
                className="group bg-surface hover:bg-surface border border-line hover:border-line rounded-2xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-ink group-hover:text-pine text-base transition-colors">
                      {c.h1}
                    </span>
                    <ArrowRight className="w-4 h-4 text-quiet group-hover:text-pine transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs text-quiet mb-3 leading-relaxed">
                    Recommended Window: <strong className="text-ink font-semibold">{c.recommendedWindow}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-pine font-medium bg-gem-gold/10 rounded-lg px-3 py-1.5 border border-line w-fit">
                  <Clock className="w-3 h-3" /> View 24-Hour Overlap Heat Map
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Informational Guidance */}
        <section className="bg-surface border border-line rounded-2xl p-6 text-sm text-quiet leading-relaxed space-y-4">
          <h2 className="font-heading text-base font-semibold text-ink">Fairness & Sustainability in Remote Scheduling</h2>
          <p>
            When teams span more than 6 time zones, finding overlapping business hours becomes challenging.
            If the same team members are consistently required to join calls early in the morning or late at night, meeting fatigue and turnover increase.
          </p>
          <p>
            Our guides offer data-backed scheduling windows and rotation recommendations so distributed remote teams can collaborate without sacrificing well-being.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
