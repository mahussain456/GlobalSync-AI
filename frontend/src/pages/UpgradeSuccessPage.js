import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { fireAnalyticsEvent } from "@/lib/analytics";

export default function UpgradeSuccessPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const plan = searchParams.get("plan") || "monthly";
  const sessionId = searchParams.get("session_id") || "";

  useEffect(() => {
    // Set paid tier state in client local storage
    localStorage.setItem("gs_is_paid", "true");

    // Upgrade all local saved teams to is_paid=true
    const localTeamsRaw = localStorage.getItem("gs_saved_teams");
    if (localTeamsRaw) {
      try {
        const teams = JSON.parse(localTeamsRaw);
        const updated = teams.map(t => {
          if (t.email.toLowerCase() === email.toLowerCase()) {
            return { ...t, is_paid: true };
          }
          return t;
        });
        localStorage.setItem("gs_saved_teams", JSON.stringify(updated));
      } catch (err) {
        console.error("Local storage team upgrade error:", err);
      }
    }

    // Fire Analytics upgrade completed event via helper
    fireAnalyticsEvent("upgrade_completed", {
      plan: plan,
      session_id: sessionId,
      email: email
    });
  }, [email, plan, sessionId]);

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative flex flex-col justify-between">
      <SEOHead
        rawTitle="Upgrade Completed | GlobalSync Pro Activation"
        description="GlobalSync Pro upgraded successfully. Welcome to unlimited team workspaces, custom URL slugs, and invoice calculations."
        noIndex={true}
      />

      {/* Luxury Background Orbs */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10" />
        <div 
          className="absolute inset-0 opacity-[0.10] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        />
      </div>

      <SiteNav />

      <main className="flex-1 max-w-md mx-auto px-6 py-20 text-center space-y-6 z-10">
        <div className="w-20 h-20 bg-gem-gold/15 border border-gem-gold/20 text-gem-gold rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(200,169,106,0.2)] animate-pulse">
          <Sparkles className="w-10 h-10 text-gem-gold" />
        </div>

        <h2 data-otto-pixel="dynamic-seo" className="text-xs font-bold uppercase tracking-wider text-gem-gold">
          Unlock the Full Potential of GlobalSync Pro
        </h2>
        <h1 className="font-heading font-extrabold text-3xl text-gem-beige">
          GlobalSync Pro Activated!
        </h1>
        
        <p className="text-sm text-gem-sage leading-relaxed">
          Welcome to the premium experience. Your email <strong className="text-gem-beige">{email}</strong> has been successfully upgraded to the Pro tier.
        </p>

        {/* Feature confirmations list */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-gem-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gem-beige block">Unlimited Workspaces</span>
              <span className="text-gem-sage/70">Create and save as many team sheets as you need.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-gem-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gem-beige block">Custom slugs and ICS Calendar Exports</span>
              <span className="text-gem-sage/70">Personalize URLs and download .ics files for calendar invites.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-gem-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gem-beige block">Invoice builder cap unlocked</span>
              <span className="text-gem-sage/70">Generate unlimited invoices and upload your custom branding logo.</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link to="/dashboard" className="w-full btn-gradient rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
            Open Dashboard App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
