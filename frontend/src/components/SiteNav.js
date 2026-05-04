import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Time Zones",      to: "/time-zone-converter" },
  { label: "Meeting Planner", to: "/meeting-planner"     },
  { label: "Currency",        to: "/currency-converter"  },
  { label: "Freelancer Rates",to: "/freelancer-rate-converter" },
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
    <header className={`bg-[#0A0F1E] border-b border-white/10 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-[#0A0F1E]/80" : ""}`}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <img
            src="/logo-dark.png.png"
            alt="GlobalSync AI"
            className="h-9 w-auto transition-transform duration-300 hover:scale-105"
            style={{ filter: "drop-shadow(0 2px 8px rgba(27,122,154,0.4))" }}
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
                  ? "text-white bg-white/5"
                  : "font-medium text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="hidden lg:block text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Chrome Extension Waitlist
          </button>
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
          >
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0F1E] px-6 py-4 flex flex-col gap-2 shadow-2xl">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === to ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
          <button className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 text-left">
            Chrome Extension Waitlist
          </button>
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold"
          >
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
