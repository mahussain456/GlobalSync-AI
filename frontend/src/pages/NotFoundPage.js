import { Link } from "react-router-dom";
import { Globe, ArrowLeft, Search } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #050816 0%, #0b1230 60%, #0d0b20 100%)" }}>
      <SEOHead
        title="Page Not Found — 404 | GlobalSync AI"
        description="The page you were looking for could not be found. Return to GlobalSync AI — free time zone converter, currency converter, and meeting planner."
        canonical="/404"
        noIndex={true}
      />

      {/* Soft orbs */}
      <div className="orb orb-blue" style={{ opacity: 0.4 }} />
      <div className="orb orb-purple" style={{ opacity: 0.3 }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        {/* Logo */}
        <Link to="/" className="mb-10 inline-block">
          <img
            src="/logo-dark.png.png"
            alt="GlobalSync AI"
            className="h-20 w-auto transition-transform duration-300 hover:scale-105"
            style={{ filter: "drop-shadow(0 0 32px rgba(27,122,154,0.7)) drop-shadow(0 0 12px rgba(255,255,255,0.2))" }}
          />
        </Link>

        {/* 404 number */}
        <div className="mb-4" style={{ fontSize: "clamp(72px, 20vw, 140px)", fontWeight: 900, fontFamily: "'Outfit', sans-serif", lineHeight: 1, background: "linear-gradient(135deg, #33B5E5, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          404
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gem-beige mb-3">
          Page not found
        </h1>
        <p className="text-gem-beige/40 text-sm md:text-base max-w-sm mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Head back home to sync with the world.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/"
            className="btn-gradient inline-flex items-center gap-2 rounded-2xl px-7 py-3 font-semibold text-sm text-gem-beige"
          >
            <Globe className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="glass-dark inline-flex items-center gap-2 rounded-2xl px-7 py-3 font-semibold text-sm text-gem-beige/70 hover:text-gem-beige transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Open Dashboard
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { label: "Time Zone Converter", to: "/time-zone-converter" },
            { label: "Currency Converter",  to: "/currency-converter"  },
            { label: "Meeting Planner",     to: "/meeting-planner"     },
            { label: "Blog",               to: "/blog"                },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="glass-dark text-xs text-gem-beige/40 hover:text-gem-beige/80 rounded-full px-3 py-1.5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom footnote */}
      <p className="text-center text-gem-beige/15 text-xs pb-8 relative z-10">
        © {new Date().getFullYear()} GlobalSync AI · <Link to="/privacy-policy" className="hover:text-gem-beige/40 transition-colors">Privacy Policy</Link>
      </p>
    </div>
  );
}
