import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Plus, X } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { buildFAQSchema } from "@/lib/seo";
import { fireAnalyticsEvent } from "@/lib/analytics";
import { DEFAULT_CITIES, EMBED_CITIES, EMBED_PATH, MAX_EMBED_CITIES, SIZES, embedHeight, embedSnippet } from "@/lib/embed";

const FAQS = [
  { q: "Is the world clock widget free?", a: "Yes. It's free for any website, personal or commercial, with no signup and no API key. The only condition is that you keep the small \"Powered by GlobalSync AI\" link visible." },
  { q: "Does the widget track my visitors or set cookies?", a: "No. The widget page loads no analytics, no ads and sets no cookies. It reads the time from our server once so the clocks are right even if a visitor's device clock is off." },
  { q: "Will it handle daylight saving time?", a: "Yes. Every city uses the IANA time zone database, the same rules your operating system uses, so clocks change on the right date automatically." },
  { q: "Can I change the cities later?", a: "Yes. The cities are part of the iframe's URL. Come back to this page, pick new cities and replace the snippet, or edit the cities= part of the URL yourself." },
];

const PARAMS = [
  ["cities", "Comma-separated city names, up to 4, spelled as in the picker above", "New York,London,Dubai,Singapore"],
  ["theme", "light or dark", "light"],
  ["format", "24 or 12 (hour clock)", "24"],
];

export default function EmbedPage() {
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [theme, setTheme] = useState("light");
  const [hour12, setHour12] = useState(false);
  const [size, setSize] = useState("standard");
  const [copied, setCopied] = useState(false);

  const opts = useMemo(() => ({ cities, theme, hour12 }), [cities, theme, hour12]);
  const snippet = embedSnippet(opts, size);
  const previewSrc = `${EMBED_PATH}?${new URLSearchParams({ cities: cities.join(","), theme, ...(hour12 ? { format: "12" } : {}) })}`;
  const width = SIZES[size].width;

  const copy = async () => {
    try { await navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* the snippet stays selectable */ }
    fireAnalyticsEvent("embed_snippet_copied", { size, theme, cities: cities.length });
  };

  const select = "min-h-[44px] w-full rounded-lg border border-line bg-paper px-3 text-ink";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEOHead
        rawTitle="Free World Clock Widget for Your Website | GlobalSync AI"
        description="Add a free, live world clock to any website: up to 4 cities, working-hours status and daylight saving handled. Copy one iframe snippet. No signup, no cookies."
        canonical="/embed"
        keywords="world clock widget, embed world clock, time zone widget for website, free clock widget, iframe world clock"
        structuredData={[{ "@context": "https://schema.org", ...buildFAQSchema(FAQS) }]}
      />
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-16">
        <header className="mb-10 max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">Free World Clock Widget for Your Website</h1>
          <p className="text-lg text-quiet leading-relaxed">
            Show your team&rsquo;s or your clients&rsquo; local times on any site. Pick up to four cities, copy one line of HTML and paste it in.
            The clocks stay live, flag working hours and weekends, and handle daylight saving on their own.
          </p>
        </header>

        <section className="grid lg:grid-cols-[1fr_1.1fr] gap-8 mb-14" aria-label="Widget builder">
          <div className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="font-semibold text-ink mb-1">Cities (up to {MAX_EMBED_CITIES})</legend>
              {cities.map((city, i) => (
                <div key={i} className="flex gap-2">
                  <select className={select} value={city} aria-label={`City ${i + 1}`} onChange={(e) => setCities((list) => list.map((c, j) => (j === i ? e.target.value : c)))}>
                    {EMBED_CITIES.map((name) => <option key={name}>{name}</option>)}
                  </select>
                  {cities.length > 1 && (
                    <button type="button" className="w-11 shrink-0 rounded-lg border border-line text-quiet grid place-items-center" aria-label={`Remove ${city}`} onClick={() => setCities((list) => list.filter((_, j) => j !== i))}>
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
              {cities.length < MAX_EMBED_CITIES && (
                <button type="button" className="inline-flex items-center gap-2 text-sm text-pine font-semibold min-h-[44px]" onClick={() => setCities((list) => [...list, EMBED_CITIES.find((n) => !list.includes(n))])}>
                  <Plus className="w-4 h-4" aria-hidden="true" /> Add a city
                </button>
              )}
            </fieldset>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-quiet space-y-1">Theme
                <select className={select} value={theme} onChange={(e) => setTheme(e.target.value)}><option value="light">Light (ivory)</option><option value="dark">Dark (forest)</option></select>
              </label>
              <label className="text-sm text-quiet space-y-1">Clock
                <select className={select} value={hour12 ? "12" : "24"} onChange={(e) => setHour12(e.target.value === "12")}><option value="24">24-hour</option><option value="12">12-hour</option></select>
              </label>
            </div>
            <label className="block text-sm text-quiet space-y-1">Size
              <select className={select} value={size} onChange={(e) => setSize(e.target.value)}>
                {Object.entries(SIZES).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
              </select>
            </label>
            <div>
              <label htmlFor="embed-snippet" className="font-semibold text-ink block mb-2">Your embed code</label>
              <textarea id="embed-snippet" readOnly value={snippet} rows={5} onFocus={(e) => e.target.select()}
                className="w-full rounded-lg border border-line bg-surface p-3 font-mono text-xs text-ink leading-relaxed" data-testid="embed-snippet" />
              <button type="button" onClick={copy} className="mt-2 inline-flex items-center gap-2 bg-pine text-paper font-semibold rounded-lg px-5 min-h-[44px]">
                {copied ? <><Check className="w-4 h-4" aria-hidden="true" /> Copied</> : <><Copy className="w-4 h-4" aria-hidden="true" /> Copy embed code</>}
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold text-ink mb-2">Live preview</p>
            <div className="rounded-xl border border-dashed border-line p-4 bg-surface overflow-hidden">
              <iframe
                key={previewSrc + size}
                src={previewSrc}
                title="World clock widget preview"
                style={{ border: 0, width: width === "100%" ? "100%" : `${width}px`, maxWidth: "100%", height: embedHeight(cities.length), display: "block" }}
                data-testid="embed-preview"
              />
            </div>
          </div>
        </section>

        <section className="max-w-3xl space-y-10">
          <div>
            <h2 className="font-heading text-2xl font-bold text-ink mb-3">How to add it to your site</h2>
            <ol className="list-decimal ml-5 space-y-2 text-quiet leading-relaxed">
              <li>Choose your cities, theme and size above, then press <strong className="text-ink">Copy embed code</strong>.</li>
              <li><strong className="text-ink">WordPress:</strong> add a <em>Custom HTML</em> block and paste the code.</li>
              <li><strong className="text-ink">Webflow, Squarespace, Wix:</strong> add an <em>Embed</em> or <em>Code</em> element and paste it.</li>
              <li><strong className="text-ink">Notion:</strong> type <code>/embed</code> and paste just the URL from inside <code>src=&quot;&hellip;&quot;</code>.</li>
              <li><strong className="text-ink">Plain HTML:</strong> paste it wherever the clock should appear.</li>
            </ol>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-ink mb-3">Settings you can change in the URL</h2>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead className="bg-wash text-left"><tr><th scope="col" className="p-3">Parameter</th><th scope="col" className="p-3">What it does</th><th scope="col" className="p-3">Default</th></tr></thead>
                <tbody>
                  {PARAMS.map(([p, d, def]) => (
                    <tr key={p} className="border-t border-line"><th scope="row" className="p-3 font-mono text-left">{p}</th><td className="p-3 text-quiet">{d}</td><td className="p-3 font-mono text-quiet">{def}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-ink mb-3">The rules</h2>
            <ul className="list-disc ml-5 space-y-2 text-quiet leading-relaxed">
              <li>Free for personal and commercial sites.</li>
              <li>Keep the &ldquo;Powered by GlobalSync AI&rdquo; link visible and unchanged.</li>
              <li>The widget sets no cookies and loads no analytics or ads.</li>
              <li>Need a full converter instead? Link to the <Link to="/time-zone-converter" className="underline text-pine">Time Zone Converter</Link> or the <Link to="/meeting-planner" className="underline text-pine">Meeting Planner</Link>.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-ink mb-3">Questions</h2>
            <div className="space-y-3">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="bg-surface border border-line rounded-xl px-5 py-4" open>
                  <summary className="font-semibold text-ink cursor-pointer">{q}</summary>
                  <p className="text-quiet text-sm mt-2 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
