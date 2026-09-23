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
              GlobalSync AI is a free, web-based utility toolkit designed for remote teams, freelancers, and global businesses. By combining high-performance world clocks, calendar overlap planners, live mid-market exchange rate indices, and deterministically verified AI search panels, GlobalSync AI acts as a calm control center that resolves the daily friction of cross-border operations.
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

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-ink mb-4">Brand Assets & Guidance</h2>
          <p className="text-sm text-quiet mb-6 leading-relaxed">
            Please use our logos and assets as provided. Do not modify the colors, alter the aspect ratios, or overlay busy background patterns behind the marks. A minimum clear space of 10% around all logo boundaries is recommended for optimal legibility.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface  rounded-xl border border-line p-5 flex items-center justify-between group">
              <div>
                <h3 className="font-semibold text-ink mb-1">High-Res Logo (Light)</h3>
                <p className="text-sm text-quiet">For dark backgrounds (PNG)</p>
              </div>
              <a href="/globalsync-ai-logo-512x128.png" download className="text-pine group-hover:text-ink transition-colors p-2 bg-gem-gold/10 rounded-lg">
                <Download className="w-5 h-5" />
              </a>
            </div>
            <div className="bg-surface  rounded-xl border border-line p-5 flex items-center justify-between group">
              <div>
                <h3 className="font-semibold text-ink mb-1">Brand Icon</h3>
                <p className="text-sm text-quiet">Standalone logomark (PNG)</p>
              </div>
              <a href="/favicon-512.png" download className="text-pine group-hover:text-ink transition-colors p-2 bg-gem-gold/10 rounded-lg">
                <Download className="w-5 h-5" />
              </a>
            </div>
          </div>
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
