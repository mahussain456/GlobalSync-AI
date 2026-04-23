import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getBlogPost, BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";
import { getBlogPostSEO } from "@/lib/seo";

// ─── Content block renderer ───────────────────────────────────────────────────
function renderBlock(block, i) {
  switch (block.type) {
    case "p":
      return <p key={i} className="text-zinc-600 leading-relaxed mb-4 text-base">{block.text}</p>;

    case "h2":
      return <h2 key={i} className="font-heading text-2xl font-bold text-zinc-900 mt-10 mb-4 pb-2 border-b border-zinc-100">{block.text}</h2>;

    case "h3":
      return <h3 key={i} className="font-heading text-lg font-semibold text-zinc-800 mt-6 mb-3">{block.text}</h3>;

    case "ul":
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 mb-5 text-zinc-600">
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
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-zinc-600 leading-relaxed">
                <strong className="text-zinc-800">{item.title}</strong>{" "}{item.desc}
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
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                {j + 1}
              </div>
              <div>
                <strong className="text-zinc-800 font-semibold">{item.title}</strong>
                <p className="text-zinc-600 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

// ─── Related Posts ────────────────────────────────────────────────────────────
function RelatedPosts({ currentSlug }) {
  const related = BLOG_POSTS.filter(p => p.slug !== currentSlug).slice(0, 2);
  return (
    <section className="mt-12 pt-8 border-t border-zinc-100">
      <h2 className="font-heading text-xl font-bold text-zinc-900 mb-5">More Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(post => {
          const style = CATEGORY_STYLES[post.categoryColor];
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm transition-all ${style.hover} group`}
            >
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.badge} mb-2 inline-block`}>{post.category}</span>
              <h3 className="font-semibold text-zinc-800 text-sm leading-snug group-hover:text-zinc-600 transition-colors">{post.title}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
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
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 py-10" data-testid="blog-post-article">
        {/* Category + meta */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>{post.category}</span>
            <span className="text-xs text-zinc-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
            <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            <span className="text-xs text-zinc-400 flex items-center gap-1 hidden sm:flex"><Tag className="w-3 h-3" /> {post.keywords.split(",")[0].trim()}</span>
          </div>

          {/* H1 */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900 leading-tight mb-5">
            {post.title}
          </h1>

          {/* Intro excerpt */}
          <p className="text-lg text-zinc-500 leading-relaxed border-l-4 border-zinc-200 pl-4">
            {post.excerpt}
          </p>
        </header>

        {/* Ad — top of post */}
        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Content */}
        <div className="prose-custom">
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* CTA */}
        <div className={`mt-10 p-6 rounded-2xl border ${
          post.categoryColor === "blue" ? "bg-blue-50 border-blue-100" :
          post.categoryColor === "emerald" ? "bg-emerald-50 border-emerald-100" :
          post.categoryColor === "orange" ? "bg-orange-50 border-orange-100" :
          "bg-violet-50 border-violet-100"
        }`} data-testid="blog-post-cta">
          <p className="font-semibold text-zinc-800 mb-3">Ready to try it yourself?</p>
          <Link
            to={post.ctaUrl}
            className={`inline-flex items-center gap-2 font-semibold text-sm ${
              post.categoryColor === "blue" ? "text-blue-600 hover:text-blue-700" :
              post.categoryColor === "emerald" ? "text-emerald-600 hover:text-emerald-700" :
              post.categoryColor === "orange" ? "text-orange-500 hover:text-orange-600" :
              "text-violet-600 hover:text-violet-700"
            }`}
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
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
