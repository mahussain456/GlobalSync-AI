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
    role: "Founder",
    bio: "Ahmed Hussain is the founder of GlobalSync AI. With over a decade of experience in software engineering and managing distributed international teams, he designs free, data-driven tools that resolve the daily friction of working across multiple time zones and currencies.",
    avatar: "AH"
  }
};

export default function AuthorPage() {
  const { slug } = useParams();
  const author = AUTHORS[slug];

  if (!author) return <Navigate to="/blog" replace />;

  const seo = getStaticPageSEO(`author-${slug}`) || {
    rawTitle: `${author.name} | Author at GlobalSync AI`,
    description: `Read expert articles and remote work guides written by ${author.name}, ${author.role} at GlobalSync AI.`,
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

      <article className="max-w-4xl mx-auto px-6 pt-36 pb-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="w-32 h-32 bg-gem-gold/20 text-gem-gold rounded-full flex items-center justify-center font-bold text-4xl shrink-0 border border-gem-gold/30">
            {author.avatar}
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-heading text-4xl font-bold text-gem-beige mb-2">
              {author.name} — Founder & Lead Author
            </h1>
            <div className="text-gem-gold font-medium mb-4">{author.role}</div>
            <p className="text-gem-beige/70 leading-relaxed max-w-2xl">
              {author.bio}
            </p>
          </div>
        </div>

        {/* Extended Bio and Experience Context Sections */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8 md:p-10 text-gem-beige/80 text-sm leading-relaxed mb-12 space-y-6">
          <h2 className="font-heading text-2xl font-bold text-gem-gold">Why I Built GlobalSync AI</h2>
          <p>
            Leading software engineering teams split across North America, Europe, and South Asia taught me that time zone math is a persistent tax on remote productivity. Missed meetings, calendar invite confusion, and late-night syncs are common pain points. I built GlobalSync AI to eliminate these friction points by providing a calm, elegant workspace where distributed teams can coordinate in seconds.
          </p>
          <p>
            As a remote contractor, I also recognized how complex it is for freelancers to model international retainers and project rates. Padded bank margins, hidden currency transaction fees, and self-employment overhead make pricing opaque. GlobalSync AI bridges this gap with mid-market currency indices and robust calculator tools.
          </p>

          <h2 className="font-heading text-2xl font-bold text-gem-gold pt-4">My Background & Expertise</h2>
          <p>
            My background combines hands-on systems architecture with agile remote management. I believe time zone awareness is the foundation of a healthy, asynchronous company culture. To ensure absolute data reliability, our timezone tools draw directly from the IANA Time Zone Database, and our exchange rate charts process institutional bank feeds daily.
          </p>
          <p>
            Additionally, I have designed our AI helper consoles using structured backend verification, preventing conversational hallucinations and ensuring that natural-language queries resolve to verified geographical and financial outputs.
          </p>
          <p>
            We maintain strict quality, research, and review standards across all our published guides. You can learn more about our commitment to editorial independence on our <Link to="/editorial-policy" className="text-gem-gold hover:underline">Editorial Policy</Link> page, discover our brand background on the <Link to="/about" className="text-gem-gold hover:underline">About Us</Link> page, or submit feedback and bug reports directly via our <Link to="/contact" className="text-gem-gold hover:underline">Contact Page</Link>.
          </p>
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
