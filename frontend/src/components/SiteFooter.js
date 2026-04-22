import { Link } from "react-router-dom";
import { Globe, Mail, Github, ArrowRight } from "lucide-react";

const TOOL_LINKS = [
  { label: "Time Zone Converter", to: "/time-zone-converter" },
  { label: "Currency Converter",  to: "/currency-converter"  },
  { label: "Meeting Planner",     to: "/meeting-planner"     },
  { label: "Open Dashboard",      to: "/dashboard"           },
];

const RESOURCE_LINKS = [
  { label: "Blog",       to: "/blog"    },
  { label: "Daily Feed", to: "/news"    },
  { label: "About Us",   to: "/about"   },
  { label: "Contact",    to: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",   to: "/privacy-policy"   },
  { label: "Terms of Service", to: "/terms-of-service" },
];

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="footer-dark-col-title">{title}</h3>
      <ul>
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className="footer-dark-link">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="footer-dark mt-16">
      {/* Thin cyan accent line at top */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(8,145,178,0.6), rgba(139,92,246,0.6), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <img
                src="/logo-dark.png.png"
                alt="GlobalSync AI"
                className="h-12 w-auto mb-4"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>
              Free AI-powered time zone converter, currency converter, and meeting planner for remote teams worldwide.
            </p>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>Sync Beyond Borders ✦</p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: Globe, label: "Website",  href: "https://globalsync-ai.com" },
                { icon: Github, label: "GitHub",  href: "https://github.com"        },
                { icon: Mail,   label: "Contact", href: "/contact"                  },
              ].map(({ icon: Icon, label, href }) => (
                href.startsWith("/") ? (
                  <Link key={label} to={href}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                    aria-label={label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                    aria-label={label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                )
              ))}
            </div>
          </div>

          <FooterCol title="Tools"     links={TOOL_LINKS}     />
          <FooterCol title="Resources" links={RESOURCE_LINKS} />
          <FooterCol title="Legal"     links={LEGAL_LINKS}    />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} GlobalSync AI · Free for everyone, worldwide.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
            Exchange rates from ExchangeRate-API · Time zones from IANA · AI by Anthropic Claude
          </p>
          <Link to="/dashboard" className="hidden sm:flex items-center gap-1 text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
          >
            Get Started <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
