import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import DesktopAppCTA from "@/components/DesktopAppCTA";
import { GUIDES, CATEGORY_STYLES } from "@/data/guidesData";
import { getGuidesIndexSEO } from "@/lib/seo";

export default function GuidesPage() {
  const seo = getGuidesIndexSEO({ guides: GUIDES });

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />
      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-pine rounded-full px-3 py-1 text-xs font-medium mb-4 border border-line">
            <BookOpen className="w-3.5 h-3.5" /> Guides
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">
            Guides for working across borders
          </h1>
          <p className="text-lg text-quiet max-w-2xl">
            Practical guides for freelancers and remote teams: scheduling across time zones, invoicing international clients, pricing your work and choosing the right tools.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="guides-grid">
          {GUIDES.map((guide) => {
            const style = CATEGORY_STYLES[guide.categoryColor];
            return (
              <article key={guide.slug} className="bg-surface rounded-xl border border-line overflow-hidden hover:border-pine transition-colors">
                <div className={`h-1 ${style.accent}`} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>{guide.category}</span>
                    <span className="text-xs text-quiet flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-ink leading-snug mb-3">
                    <Link to={`/guides/${guide.slug}`} className="hover:text-pine">{guide.title}</Link>
                  </h2>
                  <p className="text-sm text-quiet leading-relaxed mb-5 flex-1">{guide.excerpt}</p>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-pine"
                    aria-label={`Read: ${guide.title}`}
                  >
                    Read the guide <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <DesktopAppCTA placement="guides_index" />
      <SiteFooter />
    </div>
  );
}
