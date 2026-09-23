import { Link } from "react-router-dom";
import { Globe, ArrowLeft, Search } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEOHead
        rawTitle="Page Not Found | GlobalSync AI"
        description="The page you were looking for could not be found. Return to GlobalSync AI — free time zone converter, currency converter, and meeting planner."
        canonical="/404"
        noIndex={true}
      />

      <SiteNav />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        {/* Logo */}
        <Link to="/" className="mb-10 inline-block">
          <img
            src="/meridian/logo-finished.png"
            alt="GlobalSync AI"
            loading="lazy"
            width={300}
            height={100}
            className="w-auto transition-transform duration-300 hover:scale-105 "
            style={{ height: "100px" }}
          />
        </Link>

        {/* 404 number */}
        <div className="mb-4 not-found-number" aria-hidden="true">
          404
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-3">
          404 — Requested Page Was Not Found
        </h1>
        <p className="text-quiet text-sm md:text-base max-w-sm mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Head back home to sync with the world.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/"
            className="btn-gradient inline-flex items-center gap-2 rounded-2xl px-7 py-3 font-semibold text-sm text-ink"
          >
            <Globe className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="glass-dark inline-flex items-center gap-2 rounded-2xl px-7 py-3 font-semibold text-sm text-quiet hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Open Dashboard
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { label: "Home",                to: "/" },
            { label: "Time Zone Converter", to: "/time-zone-converter" },
            { label: "Meeting Planner",     to: "/meeting-planner"     },
            { label: "Currency Converter",  to: "/currency-converter"  },
            { label: "Blog",               to: "/blog"                },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="glass-dark text-xs text-quiet hover:text-quiet rounded-full px-3 py-1.5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom footnote */}
      {/* suppressHydrationWarning: year computed at prerender vs. client-mount may differ near year-end */}
      <p className="text-center text-quiet text-xs pb-8 relative z-10" suppressHydrationWarning>
        © {new Date().getFullYear()} GlobalSync AI · <Link to="/privacy-policy" className="hover:text-quiet transition-colors">Privacy Policy</Link>
      </p>
      <SiteFooter />
    </div>
  );
}
