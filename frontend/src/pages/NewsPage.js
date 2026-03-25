import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, RefreshCw, ArrowRight, Newspaper, Lightbulb } from "lucide-react";
import axios from "axios";
import SEOHead from "@/components/SEOHead";

const API = process.env.REACT_APP_BACKEND_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-zinc-100 rounded-full" />
        <div className="h-5 w-20 bg-zinc-100 rounded-full" />
      </div>
      <div className="h-4 bg-zinc-100 rounded w-full mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-4/5 mb-4" />
      <div className="h-3 bg-zinc-50 rounded w-full mb-1" />
      <div className="h-3 bg-zinc-50 rounded w-5/6 mb-1" />
      <div className="h-3 bg-zinc-50 rounded w-3/4" />
    </div>
  );
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, feedType }) {
  const isAI = feedType === "ai-news";
  const tagStyle = isAI
    ? { background: "#7F77DD", color: "#fff" }
    : { background: "#EF9F27", color: "#1a1200" };
  const label = isAI ? "AI News" : "Tips & Tricks";

  return (
    <article className="bg-white rounded-xl border border-zinc-100 p-4 hover:shadow-sm hover:border-zinc-200 transition-all group">
      {/* Tag + source + time */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={tagStyle}>
          {label}
        </span>
        <span className="text-xs text-zinc-400">{article.source}</span>
        <span className="text-xs text-zinc-300">·</span>
        <span className="text-xs text-zinc-400">{timeAgo(article.pubDateParsed)}</span>
      </div>

      {/* Headline */}
      <h2 className="font-semibold text-zinc-900 text-sm leading-snug mb-3 group-hover:text-zinc-700 transition-colors">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline underline-offset-2 inline-flex items-start gap-1"
          data-testid={`article-link-${article.title?.slice(0, 20).replace(/\s/g, "-")}`}
        >
          {article.title}
          <ExternalLink className="w-3 h-3 text-zinc-300 shrink-0 mt-0.5" />
        </a>
      </h2>

      {/* AI Summary */}
      {article.aiSummary && (
        <p className="text-xs text-zinc-500 leading-relaxed">{article.aiSummary}</p>
      )}
    </article>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────
function FeedColumn({ title, sources, articles, loading, failed, feedType }) {
  const isAI = feedType === "ai-news";
  const headerBg   = isAI ? "bg-[#7F77DD]" : "bg-[#EF9F27]";
  const headerText = isAI ? "text-white" : "text-zinc-900";
  const Icon = isAI ? Newspaper : Lightbulb;

  return (
    <div className="flex-1 min-w-0">
      {/* Column header */}
      <div className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between ${headerBg}`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${headerText}`} />
          <span className={`font-bold text-sm ${headerText}`}>{title}</span>
        </div>
        <span className={`text-xs opacity-70 ${headerText}`}>{sources}</span>
      </div>

      {/* Failed notice */}
      {failed && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
          Feed temporarily delayed — showing last cached results
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : articles.length === 0
            ? <div className="text-sm text-zinc-400 text-center py-10">No articles available right now.</div>
            : articles.map((art, i) => (
                <ArticleCard key={i} article={art} feedType={feedType} />
              ))
        }
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedAgo, setUpdatedAgo] = useState("");

  const loadFeed = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/news/feed`);
      setData(res.data);
      setLoading(false);
    } catch (e) {
      console.error("News feed error:", e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Update "X minutes ago" every minute
  useEffect(() => {
    const tick = () => {
      if (data?.ai_news?.last_updated) {
        setUpdatedAgo(timeAgo(data.ai_news.last_updated));
      }
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [data]);

  const aiArticles   = data?.ai_news?.articles  || [];
  const tipsArticles = data?.tips?.articles     || [];
  const aiUpdating   = data?.ai_news?.updating  || false;
  const tipsUpdating = data?.tips?.updating     || false;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="AI News & Tips for Remote Workers"
        description="Daily AI news from TechCrunch and The Verge plus practical tips from Ben's Bites and Zapier — summarized for remote workers."
        canonical="/news"
        keywords="AI news for remote workers, tips for remote teams, AI tools 2026, digital nomad news, remote work productivity, AI news today, tech news remote workers"
      />

      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <Link to="/"><img src="/logo-dark.png" alt="GlobalSync AI" className="h-10 w-auto rounded-lg" /></Link>
        <div className="flex items-center gap-4">
          <Link to="/time-zone-converter" className="text-sm text-zinc-500 hover:text-teal-600 transition-colors hidden sm:block">Time Zones</Link>
          <Link to="/currency-converter"  className="text-sm text-zinc-500 hover:text-teal-600 transition-colors hidden sm:block">Currency</Link>
          <Link to="/blog"               className="text-sm text-zinc-500 hover:text-teal-600 transition-colors hidden sm:block">Blog</Link>
          <Link to="/dashboard" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors">
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 mb-2">
                Daily Feed
              </h1>
              <p className="text-zinc-500 text-lg">What happened in AI today + tips you can use right now</p>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Live
                {updatedAgo && <span className="text-zinc-400 ml-1">· Updated {updatedAgo}</span>}
              </div>
              <button
                onClick={loadFeed}
                className="p-1.5 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-colors"
                title="Refresh"
                data-testid="refresh-feed-btn"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Two-column feed */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* AI News */}
          <FeedColumn
            title="AI News"
            sources="TechCrunch · The Verge"
            articles={aiArticles}
            loading={loading}
            failed={!loading && aiUpdating && aiArticles.length === 0}
            feedType="ai-news"
          />

          {/* Vertical divider — desktop only */}
          <div className="hidden lg:block w-px bg-zinc-200 self-stretch mx-2" />

          {/* Tips & Tricks */}
          <FeedColumn
            title="Tips & Tricks"
            sources="Ben's Bites · Zapier"
            articles={tipsArticles}
            loading={loading}
            failed={!loading && tipsUpdating && tipsArticles.length === 0}
            feedType="tips"
          />
        </div>

        {/* Footer note */}
        <p className="text-xs text-zinc-400 text-center mt-10">
          All articles link to their original source. Summaries generated by AI for remote workers.
        </p>
      </div>
    </div>
  );
}
