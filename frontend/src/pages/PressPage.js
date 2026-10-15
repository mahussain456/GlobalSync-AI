import { Link } from "react-router-dom";
import { Mail, ArrowRight, Download } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

export default function PressPage() {
  const seo = getStaticPageSEO("press");

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <header className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">
            GlobalSync AI: Press and Media Resources
          </h1>
          <p className="text-lg text-quiet max-w-2xl leading-relaxed">
            Resources, brand assets, and information for journalists and media professionals.
          </p>
        </header>

        <section className="mb-10 bg-surface  rounded-xl border border-line p-7 space-y-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">Product Description & Mission Statement</h2>
            <p className="text-quiet leading-relaxed">
              GlobalSync AI is a free, web-based utility toolkit designed for remote teams, freelancers, and global businesses. By combining high-performance world clocks, calendar overlap planners, live mid-market exchange rates and invoice tools, GlobalSync AI acts as a calm control center that resolves the daily friction of cross-border operations.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">Official Company & Product Boilerplate</h2>
            <p className="text-quiet leading-relaxed">
              Founded in 2026, GlobalSync AI is an independent software project dedicated to promoting healthy asynchronous working practices. Core conversion and meeting tools are free without signup. Saved teams and invoice exports have limits displayed in the tools; Pro upgrades are not currently available. GlobalSync AI is designed to protect employee personal time, reduce timezone scheduling bias, and provide transparent financial metrics for remote contractors globally.
            </p>
          </div>

          <div className="border-l border-line pl-6 py-2 my-8 italic text-quiet">
            <p className="text-base leading-relaxed mb-2">
              "Managing time zones and currency fees shouldn't require mental gymnastics. We built GlobalSync AI to automate these calculations using authoritative public databases and clean interbank feeds, allowing distributed teams to collaborate respectfully and contract transparently."
            </p>
            <cite className="text-xs font-semibold text-pine block not-italic">— Ahmed Hussain, Founder of GlobalSync AI</cite>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="media-kit">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <h2 id="media-kit" className="font-heading text-2xl font-bold text-ink">Media Kit</h2>
            <a href="/media-kit/globalsync-ai-media-kit.zip" download className="inline-flex items-center gap-2 bg-pine text-paper font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90" data-testid="media-kit-download">
              <Download className="w-4 h-4" aria-hidden="true" /> Download the media kit (.zip, 0.6 MB)
            </a>
          </div>
          <p className="text-sm text-quiet mb-6 leading-relaxed">
            Logos, app icons, brand colours, founder bio and a one-paragraph company description. Use the logos as provided: don&rsquo;t
            recolour, stretch or add effects, and leave clear space of at least 10% of the logo&rsquo;s width around them.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[["logo-wordmark.png","Wordmark","Transparent PNG, for light backgrounds"],["logo-wordmark-on-dark.png","Wordmark on forest","PNG, for dark layouts"],["icon-512.png","App icon","Ivory g on forest green, 512 px"],["icon-light-512.png","App icon (light)","Forest g on ivory, 512 px"],["brand-colors.png","Colour swatches","PNG"],["README.txt","Fact sheet","Company description, founder bio, colours, fonts"]].map(([file, title, desc]) => (
              <a key={file} href={`/media-kit/${file}`} download className="bg-surface rounded-xl border border-line p-4 flex items-center justify-between gap-3 group">
                <span><span className="block font-semibold text-ink">{title}</span><span className="block text-sm text-quiet">{desc}</span></span>
                <Download className="w-5 h-5 text-pine shrink-0" aria-label={`Download ${title}`} />
              </a>
            ))}
          </div>
          <h3 className="font-heading text-lg font-bold text-ink mb-3">Brand colours</h3>
          <ul className="flex flex-wrap gap-3 mb-8">
            {[["Forest","#0E2A1F"],["Pine","#1B4D3E"],["Ivory","#F4EFE6"],["Gold","#C8A96A"],["Sage","#A7BFAE"]].map(([name, hex]) => (
              <li key={hex} className="flex items-center gap-2 text-sm text-quiet">
                <span className="w-8 h-8 rounded-md border border-line" style={{ background: hex }} aria-hidden="true" />
                <span><span className="text-ink font-semibold">{name}</span> {hex}</span>
              </li>
            ))}
          </ul>
          <h3 className="font-heading text-lg font-bold text-ink mb-2">Founder bio</h3>
          <p className="text-quiet leading-relaxed">
            Ahmed Hussain is the founder of GlobalSync AI. With over a decade of experience in software engineering and managing distributed
            international teams, he designs free, data-driven tools that resolve the daily friction of working across multiple time zones and currencies.
          </p>
        </section>

        <section className="bg-wash rounded-2xl border border-line p-7">
          <h2 className="font-heading text-xl font-bold text-ink mb-2">Media & Press Enquiries</h2>
          <p className="text-quiet text-sm mb-4">
            If you are writing about remote team operations, digital nomad scheduling, or currency tools, we'd love to chat. Reach out directly to our press inbox:
          </p>
          <a href="mailto:press@globalsync-ai.com" className="inline-flex items-center gap-2 bg-pine text-paper font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition-all">
            <Mail className="w-4 h-4" /> press@globalsync-ai.com
          </a>
        </section>
      </article>

      <SiteFooter />
    </div>
  );
}
