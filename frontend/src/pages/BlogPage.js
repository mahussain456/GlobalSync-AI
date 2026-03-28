import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "GlobalSync AI Blog",
  "url": "https://globalsync-ai.com/blog",
  "description": "Tips, guides, and resources for remote teams, freelancers, and digital nomads on time zones, currency conversion, and global work.",
  "publisher": { "@type": "Organization", "name": "GlobalSync AI", "url": "https://globalsync-ai.com" },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="Blog — Remote Work, Time Zones & Currency Tips"
        description="Tips, guides, and resources for remote teams, freelancers, and digital nomads. Learn how to manage time zones, track live currency rates, and schedule meetings across borders."
        canonical="/blog"
        keywords="remote work blog, time zone tips, currency converter guide, digital nomad resources, freelancer tools 2026, meeting planner tips, tools for digital nomads 2026, AI tools for remote workers 2026"
        structuredData={structuredData}
      />
      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-blue-100">
            <BookOpen className="w-3.5 h-3.5" /> Resources & Guides
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
            GlobalSync AI Blog
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl">
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
                className={`bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all group ${style.hover}`}
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
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                    <span className="text-xs text-zinc-300">{post.publishDate}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold text-zinc-900 leading-snug mb-3 group-hover:text-zinc-700 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-zinc-500 leading-relaxed mb-5 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                      post.categoryColor === "blue" ? "text-blue-600 hover:text-blue-700" :
                      post.categoryColor === "emerald" ? "text-emerald-600 hover:text-emerald-700" :
                      post.categoryColor === "orange" ? "text-orange-500 hover:text-orange-600" :
                      "text-violet-600 hover:text-violet-700"
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
        <section className="mt-16 bg-white rounded-2xl border border-zinc-200 p-8">
          <h2 className="font-heading text-xl font-bold text-zinc-800 mb-3">Resources for Remote Teams, Freelancers &amp; Digital Nomads</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            The GlobalSync AI blog covers practical tips on <strong className="text-zinc-700">remote work productivity tools</strong>, <strong className="text-zinc-700">tools for digital nomads 2026</strong>, <strong className="text-zinc-700">freelancer currency tracking</strong>, and <strong className="text-zinc-700">distributed team scheduling software</strong>. Find guides on how to use a <strong className="text-zinc-700">free time zone converter no signup</strong>, get <strong className="text-zinc-700">live currency converter 160 currencies</strong>, plan meetings with a <strong className="text-zinc-700">meeting overlap planner online</strong>, and answer questions like <strong className="text-zinc-700">what is the best time to call India from the US</strong>. Whether you're a <strong className="text-zinc-700">work from anywhere</strong> professional or a team lead managing globally distributed colleagues, these guides are built for you.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
