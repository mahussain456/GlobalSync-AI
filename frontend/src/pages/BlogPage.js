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
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 pt-36 pb-12">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <BookOpen className="w-3.5 h-3.5" /> Resources & Guides
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gem-beige leading-tight mb-4">
            GlobalSync AI Remote Work & Time Zone Blog
          </h1>
          <p className="text-lg text-gem-beige/60 max-w-2xl">
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
                className={`bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 overflow-hidden hover:border-white/20 transition-all group`}
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
                    <span className="text-xs text-gem-beige/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                    <span className="text-xs text-gem-beige/30">{post.publishDate}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold text-gem-beige leading-snug mb-3 group-hover:text-gem-beige/80 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gem-beige/60 leading-relaxed mb-5 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gem-gold hover:text-gem-gold/80 transition-colors"
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
        <section className="mt-16 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">Resources for Remote Teams, Freelancers &amp; Digital Nomads</h2>
          <p className="text-sm text-gem-beige/60 leading-relaxed">
            The GlobalSync AI blog covers practical tips on <strong className="text-gem-beige">remote work productivity tools</strong>, <strong className="text-gem-beige">tools for digital nomads 2026</strong>, <strong className="text-gem-beige">freelancer currency tracking</strong>, and <strong className="text-gem-beige">distributed team scheduling software</strong>. Find guides on how to use a <Link to="/time-zone-converter" className="text-gem-gold hover:underline font-semibold">free time zone converter no signup</Link>, get a <Link to="/currency-converter" className="text-gem-gold hover:underline font-semibold">live currency converter for 160 currencies</Link>, plan meetings with a <Link to="/meeting-planner" className="text-gem-gold hover:underline font-semibold">meeting overlap planner online</Link>, and answer questions like <Link to="/us-india-meeting-time" className="text-gem-gold hover:underline font-semibold">what is the best time to call India from the US</Link>. Whether you're a <strong className="text-gem-beige">work from anywhere</strong> professional or a team lead managing globally distributed colleagues, these guides are built for you.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
