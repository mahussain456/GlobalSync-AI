import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Check } from "lucide-react";

const STORAGE_KEY = "gs_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay slightly so it doesn't flash on first paint
    const t = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9998,
        width: "min(96vw, 560px)",
        animation: "cookieSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
      `}</style>

      <div
        style={{
          background: "rgba(9,9,11,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          padding: "18px 20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          {/* Icon */}
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(8,145,178,0.25), rgba(139,92,246,0.25))",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Cookie size={18} color="rgba(255,255,255,0.7)" />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: "0 0 4px 0",
              fontSize: "14px", fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Outfit', sans-serif",
            }}>
              We use cookies &amp; ads
            </p>
            <p style={{
              margin: 0, fontSize: "12px", lineHeight: 1.55,
              color: "rgba(255,255,255,0.42)",
              fontFamily: "'Inter', sans-serif",
            }}>
              We use cookies for analytics and to serve relevant ads via Google AdSense.
              See our{" "}
              <Link to="/privacy-policy" style={{ color: "rgba(8,145,178,0.9)", textDecoration: "underline" }}>
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Dismiss X */}
          <button
            onClick={decline}
            aria-label="Decline cookies"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px",
              color: "rgba(255,255,255,0.3)", flexShrink: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
          >
            <X size={16} />
          </button>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingLeft: "52px" }}>
          <button
            onClick={accept}
            data-testid="cookie-accept-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "7px 18px", borderRadius: "40px", border: "none",
              background: "linear-gradient(135deg, #0891B2, #7C3AED)",
              color: "#fff", fontSize: "13px", fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer", transition: "opacity 0.15s, transform 0.1s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = ""; }}
          >
            <Check size={13} /> Accept All
          </button>
          <button
            onClick={decline}
            data-testid="cookie-decline-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "7px 16px", borderRadius: "40px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "rgba(255,255,255,0.45)", fontSize: "13px", fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
