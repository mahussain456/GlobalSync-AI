import { Link } from "react-router-dom";
import { Mail, ArrowRight, Download } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

export default function PressPage() {
  const seo = getStaticPageSEO("press");
  
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
            backgroundImage: "url('/world-map-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 pt-36 pb-8">
        <header className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gem-beige leading-tight mb-4">
            Press & Media
          </h1>
          <p className="text-lg text-gem-beige/60 max-w-2xl leading-relaxed">
            Resources, brand assets, and information for journalists and media professionals.
          </p>
        </header>

        <section className="mb-10 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-4">About GlobalSync AI</h2>
          <p className="text-gem-beige/70 leading-relaxed mb-4">
            GlobalSync AI is a free toolkit for remote teams, freelancers, and global workers. We provide AI-powered time zone conversion, meeting scheduling, and live currency rates to help distributed teams work together more effectively.
          </p>
          <p className="text-gem-beige/70 leading-relaxed">
            Our mission is to eliminate the friction of working globally by providing accurate, real-time data powered by the IANA timezone database and the European Central Bank.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-gem-beige mb-6">Brand Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-5 flex items-center justify-between group">
              <div>
                <h3 className="font-semibold text-gem-beige mb-1">High-Res Logo (Light)</h3>
                <p className="text-sm text-gem-beige/60">For dark backgrounds (PNG)</p>
              </div>
              <a href="/globalsync-ai-logo-512x128.png" download className="text-gem-gold group-hover:text-gem-beige transition-colors p-2 bg-gem-gold/10 rounded-lg">
                <Download className="w-5 h-5" />
              </a>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-5 flex items-center justify-between group">
              <div>
                <h3 className="font-semibold text-gem-beige mb-1">Brand Icon</h3>
                <p className="text-sm text-gem-beige/60">Standalone logomark (PNG)</p>
              </div>
              <a href="/favicon-512.png" download className="text-gem-gold group-hover:text-gem-beige transition-colors p-2 bg-gem-gold/10 rounded-lg">
                <Download className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-gem-pine/30 rounded-2xl border border-gem-gold/20 p-7">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-2">Media Enquiries</h2>
          <p className="text-gem-beige/60 text-sm mb-4">
            For press enquiries, interview requests, or further information, please contact our team.
          </p>
          <a href="mailto:press@globalsync-ai.com" className="inline-flex items-center gap-2 bg-gem-gold text-gem-forest font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition-all">
            <Mail className="w-4 h-4" /> Email Press Team
          </a>
        </section>
      </article>

      <SiteFooter />
    </div>
  );
}
