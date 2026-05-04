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
  { label: "About Us",   to: "/about"   },
  { label: "Contact",    to: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",    to: "/privacy-policy"    },
  { label: "Terms of Service",  to: "/terms-of-service"  },
  { label: "Editorial Policy",  to: "/editorial-policy"  },
  { label: "Methodology",       to: "/methodology"       },
];

const POPULAR_TIME_PAIRS = [
  { label: "Convert Time: New York to London",    to: "/time/new-york-to-london"      },
  { label: "Convert Time: London to Dubai",       to: "/time/london-to-dubai"         },
  { label: "Convert Time: New York to Tokyo",     to: "/time/new-york-to-tokyo"       },
  { label: "Convert Time: Dubai to Mumbai",       to: "/time/dubai-to-mumbai"         },
];

const POPULAR_CURRENCY_PAIRS = [
  { label: "Check USD to INR Exchange Rate",  to: "/currency/usd-to-inr" },
  { label: "Check USD to EUR Exchange Rate",  to: "/currency/usd-to-eur" },
  { label: "Check GBP to INR Exchange Rate",  to: "/currency/gbp-to-inr" },
  { label: "Check USD to NGN Exchange Rate",  to: "/currency/usd-to-ngn" },
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
                className="h-16 w-auto mb-4 transition-transform duration-300 hover:scale-105"
                style={{ filter: "drop-shadow(0 0 20px rgba(27,122,154,0.55)) drop-shadow(0 0 8px rgba(255,255,255,0.15))" }}
              />
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>
              Free AI-powered time zone converter, currency converter, and meeting planner for remote teams worldwide.
            </p>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>Sync Beyond Borders ✦</p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: Globe, label: "Website",  href: "https://www.globalsync-ai.com" },
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

          <FooterCol title="Tools"          links={TOOL_LINKS}               />
          <FooterCol title="Resources"       links={RESOURCE_LINKS}           />
          <FooterCol title="Legal"           links={LEGAL_LINKS}              />
        </div>

        {/* Popular pairs — internal linking for SEO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h3 className="footer-dark-col-title mb-3">Popular Time Zone Converters</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {POPULAR_TIME_PAIRS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="footer-dark-link text-xs">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="footer-dark-col-title mb-3">Popular Currency Pairs</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {POPULAR_CURRENCY_PAIRS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="footer-dark-link text-xs">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Financial Disclaimer */}
        <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
            <strong>Disclaimer:</strong> The currency conversion data provided on GlobalSync AI is for informational purposes only and does not constitute financial advice. While we strive to present accurate, real-time mid-market rates sourced from ExchangeRate-API and the European Central Bank, we do not guarantee the accuracy, completeness, or timeliness of the information. Exchange rates offered by your bank, payment processor, or remittance service will differ and typically include margins or hidden fees. Always verify actual rates and fees with your financial institution before initiating any international transfer, invoicing clients, or making financial decisions. GlobalSync AI accepts no liability for financial losses incurred as a result of using this tool.
          </p>
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
