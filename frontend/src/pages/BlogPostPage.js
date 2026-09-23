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
    return <p key={i} className="text-quiet leading-relaxed mb-4 text-base">{block}</p>;
  }
  switch (block.type) {
    case "p":
      return <p key={i} className="text-quiet leading-relaxed mb-4 text-base">{block.text}</p>;

    case "h2":
      return <h2 key={i} className="font-heading text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b border-line">{block.text}</h2>;

    case "h3":
      return <h3 key={i} className="font-heading text-lg font-semibold text-ink mt-6 mb-3">{block.text}</h3>;

    case "ul":
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 mb-5 text-quiet">
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
              <CheckCircle2 className="w-5 h-5 text-pine shrink-0 mt-0.5" />
              <span className="text-quiet leading-relaxed">
                <strong className="text-ink">{item.title}</strong>{" "}{item.desc}
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
              <div className="w-8 h-8 rounded-full bg-gem-gold/20 text-pine font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                {j + 1}
              </div>
              <div>
                <strong className="text-ink font-semibold">{item.title}</strong>
                <p className="text-quiet text-sm mt-1 leading-relaxed">{item.desc}</p>
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
    <section className="mt-12 pt-8 border-t border-line">
      <h2 className="font-heading text-xl font-bold text-ink mb-5">More Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(post => {
          const style = CATEGORY_STYLES[post.categoryColor];
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`bg-surface  rounded-xl border border-line p-4 hover:border-line transition-all group`}
            >
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.badge} mb-2 inline-block`}>{post.category}</span>
              <h3 className="font-semibold text-ink text-sm leading-snug group-hover:text-quiet transition-colors">{post.title}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-quiet">
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
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-12" data-testid="blog-post-article">
        {/* Category + meta */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>{post.category}</span>
            <span className="text-xs text-quiet flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
            <span className="text-xs text-quiet flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            <span className="text-xs text-quiet flex items-center gap-1 hidden sm:flex"><Tag className="w-3 h-3" /> {post.keywords.split(",")[0].trim()}</span>
          </div>

          {/* H1 */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink leading-tight mb-5">
            {post.title}
          </h1>

          {/* Author Byline */}
          {post.authorName && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center font-bold text-quiet shrink-0">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-ink">{post.authorName}</div>
                <div className="text-xs text-quiet">{post.authorRole}</div>
              </div>
            </div>
          )}

          {/* Intro excerpt */}
          <p className="text-lg text-quiet leading-relaxed border-l border-line pl-4">
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
          <div className="mt-12 bg-surface  rounded-xl border border-line rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-14 h-14 bg-paper border border-line rounded-full flex items-center justify-center font-bold text-quiet text-xl shrink-0">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-1">About the Author: {post.authorName}</h3>
              <p className="text-sm text-quiet leading-relaxed">
                {post.authorBio || "Ahmed Hussain is a technology enthusiast and experienced IT professional with a strong interest in AI, automation, and emerging digital tools. Through his blogs, he shares practical insights, simplified explanations, and real-world perspectives on how artificial intelligence and technology are changing the way we work, build, and solve problems."}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 p-6 rounded-xl bg-wash border border-line" data-testid="blog-post-cta">
          <p className="font-semibold text-ink mb-3">Ready to try it yourself?</p>
          <Link
            to={post.ctaUrl}
            className="inline-flex items-center gap-2 font-semibold text-sm text-pine hover:text-ink transition-colors"
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
        <div className="mt-8 pt-6 border-t border-line">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-quiet hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
