import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";
import { getBlogIndexSEO } from "@/lib/seo";

export default function BlogPage() {
  const seo = getBlogIndexSEO();

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <SEOHead {...seo} />
      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" /> Resources & Guides
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            GlobalSync AI Blog
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">
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
                className={`bg-[#0A0F1E] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group`}
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
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                    <span className="text-xs text-white/30">{post.publishDate}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold text-white leading-snug mb-3 group-hover:text-white/80 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-white/60 leading-relaxed mb-5 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                      post.categoryColor === "blue" ? "text-blue-400 hover:text-blue-300" :
                      post.categoryColor === "emerald" ? "text-emerald-400 hover:text-emerald-300" :
                      post.categoryColor === "orange" ? "text-orange-400 hover:text-orange-300" :
                      "text-violet-400 hover:text-violet-300"
                    }`}
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
        <section className="mt-16 bg-[#0A0F1E] rounded-2xl border border-white/10 p-8">
          <h2 className="font-heading text-xl font-bold text-white mb-3">Resources for Remote Teams, Freelancers &amp; Digital Nomads</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            The GlobalSync AI blog covers practical tips on <strong className="text-white">remote work productivity tools</strong>, <strong className="text-white">tools for digital nomads 2026</strong>, <strong className="text-white">freelancer currency tracking</strong>, and <strong className="text-white">distributed team scheduling software</strong>. Find guides on how to use a <Link to="/time-zone-converter" className="text-blue-400 hover:underline font-semibold">free time zone converter no signup</Link>, get a <Link to="/currency-converter" className="text-blue-400 hover:underline font-semibold">live currency converter for 160 currencies</Link>, plan meetings with a <Link to="/meeting-planner" className="text-blue-400 hover:underline font-semibold">meeting overlap planner online</Link>, and answer questions like <Link to="/us-india-meeting-time" className="text-blue-400 hover:underline font-semibold">what is the best time to call India from the US</Link>. Whether you're a <strong className="text-white">work from anywhere</strong> professional or a team lead managing globally distributed colleagues, these guides are built for you.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
