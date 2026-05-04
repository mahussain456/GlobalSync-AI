import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Time Zones",      to: "/time-zone-converter" },
  { label: "Currency",        to: "/currency-converter"  },
  { label: "Meeting Planner", to: "/meeting-planner"     },
  { label: "Blog",            to: "/blog"                },
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
    <header className={`bg-white border-b border-zinc-100 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "nav-glass" : "shadow-sm"}`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src="/globalsync-ai-logo-512x128.png"
            alt="GlobalSync AI"
            className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            style={{ filter: "drop-shadow(0 2px 8px rgba(27,122,154,0.25))" }}
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
                  ? "nav-link-active"
                  : "font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
              data-testid={`sitenav-${label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Open App + mobile burger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
            data-testid="sitenav-open-app"
          >
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === to ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold"
          >
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
