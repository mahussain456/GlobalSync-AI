import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";
import { BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";

const AUTHORS = {
  "ahmed-hussain": {
    name: "Ahmed Hussain",
    role: "Founder & Developer",
    bio: "Ahmed Hussain is a technology enthusiast and experienced IT professional building tools for global remote teams. With a background in managing distributed engineering teams, Ahmed writes about time zone management, asynchronous workflows, and building a more equitable global workforce.",
    avatar: "AH"
  }
};

export default function AuthorPage() {
  const { slug } = useParams();
  const author = AUTHORS[slug];

  if (!author) return <Navigate to="/blog" replace />;

  const seo = getStaticPageSEO(`author-${slug}`) || {
    rawTitle: `${author.name} | Author at GlobalSync AI`,
    description: `Read articles by ${author.name}, ${author.role} at GlobalSync AI.`,
    canonical: `/authors/${slug}`,
    keywords: `${author.name}, author GlobalSync AI, remote work articles`,
    ogType: "profile",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
          "@type": "Person",
          "name": author.name,
          "description": author.bio,
          "jobTitle": author.role,
          "worksFor": {
            "@type": "Organization",
            "name": "GlobalSync AI"
          }
        }
      }
    ]
  };

  const authorPosts = BLOG_POSTS.filter(post => post.authorName === author.name);

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="w-32 h-32 bg-gem-gold/20 text-gem-gold rounded-full flex items-center justify-center font-bold text-4xl shrink-0 border border-gem-gold/30">
            {author.avatar}
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-heading text-4xl font-bold text-gem-beige mb-2">
              {author.name}
            </h1>
            <div className="text-gem-gold font-medium mb-4">{author.role}</div>
            <p className="text-gem-beige/70 leading-relaxed max-w-2xl">
              {author.bio}
            </p>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-gem-beige mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gem-gold" /> Articles by {author.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authorPosts.map(post => {
            const style = CATEGORY_STYLES[post.categoryColor];
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-6 hover:border-white/20 transition-all group flex flex-col h-full"
              >
                <div className="mb-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.badge} mb-3 inline-block`}>{post.category}</span>
                  <h3 className="font-bold text-lg text-gem-beige leading-snug group-hover:text-gem-beige/80 transition-colors mb-2">{post.title}</h3>
                  <p className="text-sm text-gem-beige/60 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gem-beige/40">
                  <span>{post.publishDate}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-gem-beige/50 hover:text-gem-beige transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
