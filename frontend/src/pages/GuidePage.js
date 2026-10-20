import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle2, Info } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import DesktopAppCTA from "@/components/DesktopAppCTA";
import ToolCTA from "@/components/ToolCTA";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getGuide, GUIDES, CATEGORY_STYLES, TOOL_LINKS, GUIDE_RELATED_PAGES, plainText } from "@/data/guidesData";
import { getGuideSEO, buildFAQSchema } from "@/lib/seo";
import { useLiveFacts, fillDeep, fillText, hasLiveTokens } from "@/lib/liveFacts";

// ─── Inline markup: [text](/path) and **bold** ───────────────────────────────
const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

const LINK_CLASS = "text-pine font-semibold underline decoration-line underline-offset-2 hover:decoration-pine";

// Bold text may contain links, so bold content is parsed again (one level is enough).
function parseInline(text, keyPrefix = "") {
  const out = [];
  let last = 0;
  let m;
  const re = new RegExp(INLINE.source, "g");
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}${m.index}`;
    if (m[1]) {
      out.push(<Link key={key} to={m[2]} className={LINK_CLASS}>{m[1]}</Link>);
    } else if (keyPrefix) {
      out.push(m[3]);
    } else {
      out.push(<strong key={key} className="text-ink font-semibold">{parseInline(m[3], `${key}-`)}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Rich({ text }) {
  return <>{parseInline(text)}</>;
}

// ─── Content blocks ──────────────────────────────────────────────────────────
function renderBlock(block, i) {
  switch (block.type) {
    case "p":
      return <p key={i} className="text-quiet leading-relaxed mb-4 text-base"><Rich text={block.text} /></p>;

    case "h2":
      return <h2 key={i} className="font-heading text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b border-line">{block.text}</h2>;

    case "h3":
      return <h3 key={i} className="font-heading text-lg font-semibold text-ink mt-6 mb-3">{block.text}</h3>;

    case "ul":
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 mb-5 text-quiet">
          {block.items.map((item, j) => (
            <li key={j} className="leading-relaxed"><Rich text={item} /></li>
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
                <p className="text-quiet text-sm mt-1 leading-relaxed"><Rich text={item.desc} /></p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <figure key={i} className="my-6">
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-wash">
                <tr>
                  {block.headers.map((h, j) => (
                    <th key={j} scope="col" className="px-4 py-3 font-semibold text-ink border-b border-line align-bottom">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-line last:border-b-0 align-top">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="px-4 py-3 font-medium text-ink">{cell}</th>
                      ) : (
                        <td key={c} className="px-4 py-3 text-quiet leading-relaxed"><Rich text={cell} /></td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <figcaption className="text-xs text-quiet mt-2 leading-relaxed">{block.note}</figcaption>}
        </figure>
      );

    case "pre":
      return (
        <pre key={i} className="my-5 rounded-xl border border-line bg-wash px-4 py-3 text-sm text-ink whitespace-pre-wrap font-mono leading-relaxed">
          {block.text}
        </pre>
      );

    case "cta":
      return <ToolCTA key={i} {...block} />;

    default:
      return null;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const { slug } = useParams();
  const source = getGuide(slug);
  if (!source) return <Navigate to="/guides" replace />;
  return <GuideBody key={source.slug} source={source} />;
}

function GuideBody({ source }) {
  // Rates and meeting times in the copy are live tokens, filled here.
  const facts = useLiveFacts(source);
  const guide = useMemo(() => fillDeep(source, facts), [source, facts]);
  const showLiveNote = useMemo(() => hasLiveTokens(source.content), [source]);
  const liveKinds = useMemo(() => {
    const raw = JSON.stringify(source);
    return { fx: /\{fx/.test(raw), time: /\{(t|abbr|day)[:}]/.test(raw) };
  }, [source]);

  const style = CATEGORY_STYLES[guide.categoryColor];
  const seo = getGuideSEO({ guide });
  // Same-category guides first, then the next guides in list order, so every
  // guide is linked from other guides rather than only the first two.
  const others = GUIDES.filter((g) => g.slug !== guide.slug);
  const start = GUIDES.findIndex((g) => g.slug === guide.slug);
  const rotated = [...others.slice(start), ...others.slice(0, start)];
  const related = [...rotated.filter((g) => g.category === guide.category), ...rotated.filter((g) => g.category !== guide.category)].slice(0, 3);
  const relatedPages = GUIDE_RELATED_PAGES[guide.slug] || [];
  // Plain-text answers: JSON-LD must not contain markup.
  const faqSchema = {
    "@context": "https://schema.org",
    ...buildFAQSchema(guide.faqs.map(({ q, a }) => ({ q, a: plainText(a) }))),
  };

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-12" data-testid="guide-article">
        <nav aria-label="Breadcrumb" className="text-xs text-quiet mb-6">
          <Link to="/" className="hover:text-ink">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link to="/guides" className="hover:text-ink">Guides</Link>
        </nav>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>{guide.category}</span>
            <span className="text-xs text-quiet flex items-center gap-1"><Calendar className="w-3 h-3" /> Updated {guide.publishDate}</span>
            <span className="text-xs text-quiet flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink leading-tight mb-5">{guide.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center font-bold text-quiet shrink-0">
              {guide.authorName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-ink">{guide.authorName}</div>
              <div className="text-xs text-quiet">{guide.authorRole}</div>
            </div>
          </div>

          <p className="text-lg text-quiet leading-relaxed border-l border-line pl-4">{guide.excerpt}</p>

          {guide.disclosure && (
            <p className="mt-5 flex gap-2 text-sm text-quiet bg-wash border border-line rounded-xl px-4 py-3 leading-relaxed" data-testid="guide-disclosure">
              <Info className="w-4 h-4 text-pine shrink-0 mt-0.5" aria-hidden="true" />
              <span>{guide.disclosure}</span>
            </p>
          )}
        </header>

        <AdBanner slot="leaderboard" className="mb-8" />

        {showLiveNote && (
          <p className="mb-8 flex gap-2 text-sm text-quiet bg-wash border border-line rounded-xl px-4 py-3 leading-relaxed" data-testid="guide-live-note">
            <Clock className="w-4 h-4 text-pine shrink-0 mt-0.5" aria-hidden="true" />
            <span suppressHydrationWarning>
              The numbers in this guide update themselves.
              {liveKinds.fx && facts.rateDate && <> Exchange rates: {facts.source} as of {facts.rateDate}.</>}
              {liveKinds.time && <> Meeting times are for {fillText("{day}", facts)}, with daylight saving applied.</>}
            </span>
          </p>
        )}

        <div className="prose-custom">{guide.content.map(renderBlock)}</div>

        {/* FAQ — visible on the page, mirrored in the JSON-LD below */}
        <section className="mt-12" aria-labelledby="faq-heading" data-testid="guide-faq">
          <h2 id="faq-heading" className="font-heading text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {guide.faqs.map(({ q, a }) => (
              <details key={q} className="group bg-surface border border-line rounded-xl px-5 py-4" open>
                <summary className="font-semibold text-ink cursor-pointer list-none flex justify-between gap-4">
                  {q}
                  <span aria-hidden="true" className="text-quiet group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-quiet leading-relaxed mt-3 text-sm"><Rich text={a} /></p>
              </details>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mt-12" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="font-heading text-xl font-bold text-ink mb-4">Tools mentioned in this guide</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.links.map((key) => {
              const tool = TOOL_LINKS[key];
              return (
                <li key={key}>
                  <Link to={tool.to} className="flex gap-3 h-full bg-surface border border-line rounded-xl p-4 hover:border-pine transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-pine shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-ink text-sm">{tool.label}</span>
                      <span className="block text-xs text-quiet leading-relaxed mt-1">{tool.desc}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {relatedPages.length > 0 && (
          <section className="mt-10" aria-labelledby="related-pages-heading">
            <h2 id="related-pages-heading" className="font-heading text-xl font-bold text-ink mb-4">Related pages</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedPages.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className="flex items-center justify-between gap-3 h-full bg-surface border border-line rounded-xl p-4 text-sm font-semibold text-ink hover:border-pine transition-colors">
                    <span>{p.label}</span> <ArrowRight className="w-4 h-4 text-pine shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 bg-surface rounded-2xl border border-line p-6 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-14 h-14 bg-paper border border-line rounded-full flex items-center justify-center font-bold text-quiet text-xl shrink-0">
            {guide.authorName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-ink mb-1">About the author: {guide.authorName}</h3>
            <p className="text-sm text-quiet leading-relaxed">{guide.authorBio}</p>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-xl bg-wash border border-line" data-testid="guide-cta">
          <p className="font-semibold text-ink mb-3">Ready to try it yourself?</p>
          <Link to={guide.ctaUrl} className="inline-flex items-center gap-2 font-semibold text-sm text-pine hover:text-ink transition-colors">
            {guide.ctaText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <NewsletterSignup placement="guide" className="mt-10" />

        <AdBanner slot="rectangle" className="mt-8" />

        <section className="mt-12 pt-8 border-t border-line">
          <h2 className="font-heading text-xl font-bold text-ink mb-5">More guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((g) => (
              <Link key={g.slug} to={`/guides/${g.slug}`} className="bg-surface rounded-xl border border-line p-4 hover:border-pine transition-colors">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[g.categoryColor].badge} mb-2 inline-block`}>{g.category}</span>
                <h3 className="font-semibold text-ink text-sm leading-snug">{g.title}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-quiet"><Clock className="w-3 h-3" /> {g.readTime}</div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-line">
          <Link to="/guides" className="flex items-center gap-2 text-sm text-quiet hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all guides
          </Link>
        </div>

        {/* FAQPage JSON-LD at the bottom of the post (content is static, from guidesData). */}
        <script
          type="application/ld+json"
          data-testid="guide-faq-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
      </article>

      <DesktopAppCTA placement="guide" />
      <SiteFooter />
    </div>
  );
}

