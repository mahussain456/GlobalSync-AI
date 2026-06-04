import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Globe, Sparkles, Loader2, ArrowRight } from "lucide-react";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

export default function OnboardingModal({ onComplete }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = success

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/users/register`, { name: name.trim(), email: email.trim() });
    } catch { /* still proceed */ }
    localStorage.setItem("gs_user", JSON.stringify({ name: name.trim(), email: email.trim() }));
    setStep(2);
    setTimeout(() => onComplete({ name: name.trim(), email: email.trim() }), 1200);
    setLoading(false);
  };

  const handleSkip = () => {
    localStorage.setItem("gs_user", JSON.stringify({ name: "Guest", email: "" }));
    onComplete({ name: "Guest", email: "" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center onboarding-overlay fade-in" data-testid="onboarding-modal">
      <div className="onboarding-card w-full max-w-md mx-4 p-8 fade-in-up">
        {step === 1 ? (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link to="/">
                <img
                  src="/logo-dark.png"
                  alt="GlobalSync AI"
                  loading="lazy"
                  className="w-auto transition-transform duration-300 hover:scale-105 logo-glowing-effect"
                  style={{ height: "72px" }}
                />
              </Link>
            </div>

            {/* Headline */}
            <h2 className="font-heading text-3xl font-bold text-gem-beige mb-2 leading-tight">
              Welcome aboard.{" "}
              <span className="gradient-text">Let's sync</span>
            </h2>
            <p className="text-gem-beige/50 text-sm mb-8 leading-relaxed">
              Enter your name and email to get started — no password, no subscription. Just free access.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-gem-beige/60 text-xs font-medium mb-1.5 block uppercase tracking-wider">Your Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="onboarding-input"
                  data-testid="onboarding-name-input"
                  required
                />
              </div>
              <div>
                <label className="text-gem-beige/60 text-xs font-medium mb-1.5 block uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="onboarding-input"
                  data-testid="onboarding-email-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full btn-gradient rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                data-testid="onboarding-submit-btn"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get Started — It's Free
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={handleSkip}
              className="w-full mt-4 text-gem-beige/30 hover:text-gem-beige/60 text-sm transition-colors py-1"
              data-testid="onboarding-skip-btn"
            >
              Skip for now
            </button>
          </>
        ) : (
          /* Success step */
          <div className="text-center py-6 fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gem-gold to-gem-sage flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-gem-beige" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-gem-beige mb-2">Welcome, {name}!</h3>
            <p className="text-gem-beige/50 text-sm">Opening your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
