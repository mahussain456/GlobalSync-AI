import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";
import { getBlogIndexSEO } from "@/lib/seo";

export default function BlogPage() {
  const seo = getBlogIndexSEO({ posts: BLOG_POSTS });

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        {/* Header */}
        <header className="mb-12"><h1 className="font-heading text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">
            GlobalSync AI: Expert Guides for Global Remote Work
          </h1>
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-pine rounded-full px-3 py-1 text-xs font-medium mb-4 border border-line">
            <BookOpen className="w-3.5 h-3.5" /> Resources & Guides
          </div>

          <p className="text-lg text-quiet max-w-2xl">
            Practical guides for remote teams, freelancers, and digital nomads — covering time zones, currency, and the tools that make global work easier.
          </p>
        </header>

        {/* Blog post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="blog-grid">
          {BLOG_POSTS.map((post) => {
            const style = CATEGORY_STYLES[post.categoryColor];
            return (
              <article
                key={post.slug}
                className={`bg-surface  rounded-xl border border-line overflow-hidden hover:border-line transition-all group`}
                data-testid={`blog-card-${post.slug}`}
              >
                {/* Color accent top bar */}
                <div className={`h-1 ${style.accent}`} />
                <div className="p-6 flex flex-col h-full">
                  {/* Meta row */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-quiet flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                    <span className="text-xs text-quiet">{post.publishDate}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold text-ink leading-snug mb-3 group-hover:text-quiet transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-quiet leading-relaxed mb-5 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-pine hover:text-pine transition-colors"
                    data-testid={`read-more-${post.slug}`}
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* SEO text block */}
        <section className="mt-16 bg-surface  rounded-xl border border-line p-8">
          <h2 className="font-heading text-xl font-bold text-ink mb-3">Resources for Remote Teams, Freelancers &amp; Digital Nomads</h2>
          <p className="text-sm text-quiet leading-relaxed">
            The GlobalSync AI blog covers practical tips on <strong className="text-ink">remote work productivity tools</strong>, <strong className="text-ink">tools for digital nomads 2026</strong>, <strong className="text-ink">freelancer currency tracking</strong>, and <strong className="text-ink">distributed team scheduling software</strong>. Find guides on how to use a <Link to="/time-zone-converter" className="text-pine hover:underline font-semibold">free time zone converter no signup</Link>, get a <Link to="/currency-converter" className="text-pine hover:underline font-semibold">live currency converter for 160 currencies</Link>, plan meetings with a <Link to="/meeting-planner" className="text-pine hover:underline font-semibold">meeting overlap planner online</Link>, and answer questions like <Link to="/us-india-meeting-time" className="text-pine hover:underline font-semibold">what is the best time to call India from the US</Link>. Whether you're a <strong className="text-ink">work from anywhere</strong> professional or a team lead managing globally distributed colleagues, these guides are built for you.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
