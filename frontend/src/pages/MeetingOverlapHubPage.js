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
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead
        rawTitle="Best Meeting Times & Timezone Overlap Guides | GlobalSync AI"
        description="Find the best meeting times between global regions (US, India, UK, Europe, Philippines, Australia). 24-hour overlap heatmaps & team fairness guides."
        canonical="/meeting-overlap"
        keywords="global meeting times, distributed team scheduling, time zone overlap, remote work collaboration, international meeting planner"
        schema={[breadcrumbSchema]}
      />

      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <span className="text-gem-mist">Meeting Overlap Guides</span>
        </nav>

        {/* H1 + Intro */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <Users className="w-3.5 h-3.5" /> 8 Global Region Corridors · Rotation Fairness
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-4">
            Best Meeting Times & Overlap Guides
          </h1>
          <p className="text-gem-mist text-lg max-w-3xl leading-relaxed">
            Stop guessing cross-border meeting slots. Explore recommended meeting windows, 24-hour schedule heat maps, and rotation-fairness strategies for distributed teams.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/meeting-planner"
              className="inline-flex items-center gap-1.5 bg-gem-gold text-gem-forest font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-gem-gold/90 transition-colors"
            >
              <Calendar className="w-4 h-4" /> Open Meeting Planner
            </Link>
            <Link
              to="/time-zone-converter"
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/20 text-gem-beige text-sm rounded-xl px-4 py-2.5 hover:bg-white/10 transition-colors"
            >
              Time Zone Converter
            </Link>
          </div>
        </header>

        {/* Corridor Grid */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gem-gold" />
            Popular Meeting Corridors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEETING_CORRIDORS.map(c => (
              <Link
                key={c.slug}
                to={`/meeting-overlap/${c.slug}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gem-gold/30 rounded-2xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-gem-beige group-hover:text-gem-gold text-base transition-colors">
                      {c.h1}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gem-sage group-hover:text-gem-gold transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gem-sage mb-3 leading-relaxed">
                    Recommended Window: <strong className="text-gem-beige font-semibold">{c.recommendedWindow}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gem-gold font-medium bg-gem-gold/10 rounded-lg px-3 py-1.5 border border-gem-gold/20 w-fit">
                  <Clock className="w-3 h-3" /> View 24-Hour Overlap Heat Map
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Informational Guidance */}
        <section className="bg-white/3 border border-white/8 rounded-2xl p-6 text-sm text-gem-sage leading-relaxed space-y-4">
          <h2 className="font-heading text-base font-semibold text-gem-beige">Fairness & Sustainability in Remote Scheduling</h2>
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
