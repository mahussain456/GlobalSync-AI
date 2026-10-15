import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { NEWSLETTER, newsletterConfigured } from "@/config/newsletter";
import { fireAnalyticsEvent } from "@/lib/analytics";

// Plain HTML form post to the owner's email provider (see src/config/newsletter.js).
// The provider handles double opt-in and unsubscribes; we store nothing.
export default function NewsletterSignup({ placement = "footer", className = "" }) {
  const [sent, setSent] = useState(false);
  const configured = newsletterConfigured();

  if (!configured) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <aside className={`rounded-xl border border-dashed border-line p-5 text-sm text-quiet ${className}`} data-testid="newsletter-unconfigured">
        <strong className="text-ink">Newsletter signup (not live yet).</strong> Set REACT_APP_NEWSLETTER_ACTION to your email provider's
        form URL to show the signup form here. See docs/NEWSLETTER.md. This note only appears in development.
      </aside>
    );
  }

  const id = `newsletter-${placement}`;
  return (
    <section className={`rounded-xl border border-line bg-surface p-6 md:p-7 ${className}`} aria-labelledby={`${id}-title`} data-testid="newsletter-signup">
      <div className="flex items-start gap-3 mb-3">
        <Mail className="w-5 h-5 text-pine shrink-0 mt-1" aria-hidden="true" />
        <div>
          <h2 id={`${id}-title`} className="font-heading text-xl font-bold text-ink">Weekly remote-work tips</h2>
          <p className="text-sm text-quiet mt-1 leading-relaxed">{NEWSLETTER.promise}</p>
        </div>
      </div>
      {sent ? (
        <p className="text-sm text-ink font-medium" role="status">Almost done. Check your inbox and confirm your email to start getting the tips.</p>
      ) : (
        <form
          action={NEWSLETTER.action}
          method="post"
          target="_blank"
          rel="noopener"
          onSubmit={() => { fireAnalyticsEvent("newsletter_signup_submitted", { placement }); setTimeout(() => setSent(true), 0); }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
            <input id={`${id}-email`} name={NEWSLETTER.emailField} type="email" required autoComplete="email" maxLength={254}
              placeholder="you@example.com"
              className="flex-1 min-h-[44px] rounded-lg border border-line bg-paper px-4 text-ink placeholder:text-quiet focus:outline-none focus:ring-2 focus:ring-pine" />
            <button type="submit" className="min-h-[44px] rounded-lg bg-pine text-paper font-semibold px-5 hover:opacity-90">Subscribe</button>
          </div>
          <label className="flex items-start gap-2 text-xs text-quiet leading-relaxed">
            <input type="checkbox" required className="mt-0.5 accent-pine" />
            <span>
              I agree to receive this weekly email. My address is sent to our email provider only for this newsletter.
              See the <Link to="/privacy-policy" className="underline text-pine">Privacy Policy</Link>.
            </span>
          </label>
        </form>
      )}
    </section>
  );
}
