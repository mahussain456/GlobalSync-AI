import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getBlogPost, BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";
import { getBlogPostSEO } from "@/lib/seo";
import ToolCTA from "@/components/ToolCTA";

// ─── Content block renderer ───────────────────────────────────────────────────
function renderBlock(block, i) {
  if (typeof block === "string") {
    return <p key={i} className="text-gem-beige/70 leading-relaxed mb-4 text-base">{block}</p>;
  }
  switch (block.type) {
    case "p":
      return <p key={i} className="text-gem-beige/70 leading-relaxed mb-4 text-base">{block.text}</p>;

    case "h2":
      return <h2 key={i} className="font-heading text-2xl font-bold text-gem-beige mt-10 mb-4 pb-2 border-b border-white/10">{block.text}</h2>;

    case "h3":
      return <h3 key={i} className="font-heading text-lg font-semibold text-gem-beige mt-6 mb-3">{block.text}</h3>;

    case "ul":
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 mb-5 text-gem-beige/70">
          {block.items.map((item, j) => (
            <li key={j} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );

    case "ul-bold":
      return (
        <ul key={i} className="space-y-4 mb-5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-gem-gold shrink-0 mt-0.5" />
              <span className="text-gem-beige/70 leading-relaxed">
                <strong className="text-gem-beige">{item.title}</strong>{" "}{item.desc}
              </span>
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={i} className="space-y-5 mb-5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gem-gold/20 text-gem-gold font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                {j + 1}
              </div>
              <div>
                <strong className="text-gem-beige font-semibold">{item.title}</strong>
                <p className="text-gem-beige/70 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "cta":
      return (
        <ToolCTA
          key={i}
          title={block.title}
          description={block.description}
          primaryLink={block.primaryLink}
          primaryText={block.primaryText}
          secondaryLink={block.secondaryLink}
          secondaryText={block.secondaryText}
        />
      );

    default:
      return null;
  }
}

// ─── Related Posts ────────────────────────────────────────────────────────────
function RelatedPosts({ currentSlug }) {
  const related = BLOG_POSTS.filter(p => p.slug !== currentSlug).slice(0, 2);
  return (
    <section className="mt-12 pt-8 border-t border-white/10">
      <h2 className="font-heading text-xl font-bold text-gem-beige mb-5">More Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(post => {
          const style = CATEGORY_STYLES[post.categoryColor];
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:border-white/20 transition-all group`}
            >
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.badge} mb-2 inline-block`}>{post.category}</span>
              <h3 className="font-semibold text-gem-beige text-sm leading-snug group-hover:text-gem-beige/80 transition-colors">{post.title}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-gem-beige/40">
                <Clock className="w-3 h-3" /> {post.readTime}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Main Post Page ───────────────────────────────────────────────────────────
export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const style = CATEGORY_STYLES[post.categoryColor];
  const seo = getBlogPostSEO({ post });

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

      <article className="max-w-3xl mx-auto px-6 pt-36 pb-12" data-testid="blog-post-article">
        {/* Category + meta */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>{post.category}</span>
            <span className="text-xs text-gem-beige/40 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
            <span className="text-xs text-gem-beige/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            <span className="text-xs text-gem-beige/40 flex items-center gap-1 hidden sm:flex"><Tag className="w-3 h-3" /> {post.keywords.split(",")[0].trim()}</span>
          </div>

          {/* H1 */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige leading-tight mb-5">
            {post.title}
          </h1>

          {/* Author Byline */}
          {post.authorName && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-gem-beige/50 shrink-0">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-gem-beige">{post.authorName}</div>
                <div className="text-xs text-gem-beige/50">{post.authorRole}</div>
              </div>
            </div>
          )}

          {/* Intro excerpt */}
          <p className="text-lg text-gem-beige/70 leading-relaxed border-l-4 border-white/10 pl-4">
            {post.excerpt}
          </p>
        </header>

        {/* Ad — top of post */}
        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Content */}
        <div className="prose-custom">
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* Author Bio */}
        {post.authorName && (
          <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-14 h-14 bg-gem-forest border border-white/10 rounded-full flex items-center justify-center font-bold text-gem-beige/50 text-xl shrink-0">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gem-beige mb-1">About the Author: {post.authorName}</h3>
              <p className="text-sm text-gem-beige/70 leading-relaxed">
                {post.authorBio || "Ahmed Hussain is a technology enthusiast and experienced IT professional with a strong interest in AI, automation, and emerging digital tools. Through his blogs, he shares practical insights, simplified explanations, and real-world perspectives on how artificial intelligence and technology are changing the way we work, build, and solve problems."}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 p-6 rounded-[28px] bg-gem-pine border border-white/10" data-testid="blog-post-cta">
          <p className="font-semibold text-gem-beige mb-3">Ready to try it yourself?</p>
          <Link
            to={post.ctaUrl}
            className="inline-flex items-center gap-2 font-semibold text-sm text-gem-gold hover:text-gem-beige transition-colors"
            data-testid="blog-cta-link"
          >
            {post.ctaText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Ad — bottom of post */}
        <AdBanner slot="rectangle" className="mt-8" />

        {/* Related posts */}
        <RelatedPosts currentSlug={post.slug} />

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-gem-beige/50 hover:text-gem-beige transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
