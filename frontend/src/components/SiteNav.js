import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Time Zones",       to: "/time-zone-converter" },
  { label: "Meeting Planner",  to: "/meeting-planner"     },
  { label: "Currency",         to: "/currency-converter"  },
  { label: "Freelancer Rates", to: "/freelancer-rate-converter" },
  { label: "Blog",             to: "/blog"                },
];

export default function SiteNav() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`bg-gem-forest border-b border-white/10 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-gem-forest/80" : ""}`}>
      <nav className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 flex items-center gap-2 group">
          <img
            src="/logo-dark.webp"
            alt="GlobalSync AI"
            decoding="async"
            width={255}
            height={85}
            className="w-auto transition-all duration-300 hover:scale-105"
            style={{ height: "85px", filter: "drop-shadow(0px 0px 12px rgba(200, 169, 106, 0.4))" }}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === to
                  ? "text-gem-gold bg-white/5 font-semibold"
                  : "font-medium text-gem-beige/70 hover:text-gem-beige hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gem-gold text-gem-forest text-sm font-bold hover:opacity-90 shadow-[0_4px_14px_rgba(200,169,106,0.15)] hover:shadow-[0_6px_20px_rgba(200,169,106,0.25)] transition-all"
          >
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-gem-beige/60 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-gem-forest px-6 py-4 flex flex-col gap-2 shadow-2xl">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === to ? "bg-white/10 text-gem-gold" : "text-gem-beige/70 hover:bg-white/5 hover:text-gem-beige"
              }`}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gem-gold text-gem-forest text-sm font-bold hover:opacity-90 transition-all"
          >
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
