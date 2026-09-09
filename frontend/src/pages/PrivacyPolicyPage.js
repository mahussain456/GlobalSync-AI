import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const LAST_UPDATED = "March 2026";

export default function PrivacyPolicyPage() {
  const seo = getStaticPageSEO("privacy-policy");

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead {...seo} />

      {/* LUXURY HERO BACKGROUND with World Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        {/* Subtle gradient overlay to soften */}
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10"></div>
        {/* World Map Background */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-36 pb-8">
        <header className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gem-beige mb-3">GlobalSync AI Privacy Policy & Security</h1>
          <p className="text-sm text-gem-beige/40">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="bg-gem-pine/30 rounded-xl border border-gem-gold/20 p-4 mb-8 text-sm text-gem-sage">
          <strong className="text-gem-gold">Summary:</strong> GlobalSync AI is a free tool. We collect minimal data, do not sell your information, and use standard analytics to improve the service.
        </div>

        <div className="space-y-8 text-gem-beige/70 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">1. Who We Are & How to Reach Us</h2>
            <p>GlobalSync AI (<strong className="text-gem-beige">globalsync-ai.com</strong>) is a free online toolkit providing real-time world clocks, time zone conversion, live currency conversion, and AI-assisted meeting planning for remote teams, freelancers, and global businesses. When we say "we", "our", or "us" in this policy, we refer to GlobalSync AI and its operator, Ahmed Hussain.</p>
            <p className="mt-2">We act as the data controller for any personal information collected when you browse our site, use our web applications, or voluntarily contact our support channels.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">2. Information We Collect & How It Is Collected</h2>
            <h3 className="font-semibold text-gem-beige/90 mb-2">2a. Information You Provide Voluntarily</h3>
            <p className="mb-3">When you use our optional onboarding form, submit a contact message, or create a custom team workspace, you may choose to provide:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-gem-beige">Contact details:</strong> Your name and email address</li>
              <li><strong className="text-gem-beige">Communication records:</strong> Subject lines, message contents, and feedback submitted via our contact forms</li>
              <li><strong className="text-gem-beige">Workspace data:</strong> Team workspace names, member labels, and timezone preferences</li>
            </ul>
            <p className="mt-3">Providing this information is entirely optional and is never required to use our core conversion tools. You can use all time zone, currency, and meeting tools anonymously without registering an account.</p>

            <h3 className="font-semibold text-gem-beige/90 mb-2 mt-5">2b. Information Collected Automatically</h3>
            <p className="mb-3">When you navigate GlobalSync AI, our servers and analytics providers automatically log standard technical data, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-gem-beige">Usage data:</strong> Pages visited, features accessed, tool conversion queries entered (anonymised and aggregated)</li>
              <li><strong className="text-gem-beige">Device & browser metadata:</strong> Browser type, version, operating system, display resolution, and language preferences</li>
              <li><strong className="text-gem-beige">Network identifiers:</strong> Anonymised IP address, referring website URL, timestamps, and request latency</li>
            </ul>

            <h3 className="font-semibold text-gem-beige/90 mb-2 mt-5">2c. Cookies & Storage Technologies</h3>
            <p>We use essential cookies, browser local storage, and third-party tracking scripts to operate and optimize GlobalSync AI:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li><strong className="text-gem-beige">Essential local storage:</strong> Used to save your selected city lists, base currency preferences, and workspace settings locally on your device without sending them to external marketing servers.</li>
              <li><strong className="text-gem-beige">Analytics cookies (Google Analytics & PostHog):</strong> Help us measure site traffic, identify performance bottlenecks, and understand feature usage patterns across regions.</li>
              <li><strong className="text-gem-beige">Advertising cookies (Google AdSense):</strong> Serve contextual or non-personalised advertisements to support our free operations.</li>
            </ul>
            <p className="mt-3">You can disable or delete cookies via your browser settings at any time. Essential tools will remain functional, though custom saved settings may revert upon page reload.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">3. How We Use Your Information & Legal Basis</h2>
            <p>We process personal and technical data under the following legal bases and operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li><strong className="text-gem-beige">Service Delivery (Contract / Legitimate Interest):</strong> To render accurate time conversions, live exchange rate outputs, and custom team schedule overlays.</li>
              <li><strong className="text-gem-beige">System Reliability & Abuse Prevention (Legitimate Interest):</strong> To monitor API rate limits, prevent automated bot scraping, and maintain server availability.</li>
              <li><strong className="text-gem-beige">Product Communications (Consent):</strong> To send occasional product updates or team productivity tips if you explicitly opt-in via our onboarding modal.</li>
              <li><strong className="text-gem-beige">Analytics & Optimization (Legitimate Interest / Consent):</strong> To analyze aggregated usage trends and improve conversion algorithms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">4. Third-Party Data Processors</h2>
            <p>GlobalSync AI partners with trusted third-party infrastructure and service providers. Each provider operates under strict data protection protocols:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm mt-3">
              <li><strong className="text-gem-beige">Google Analytics (Google LLC):</strong> Aggregated site measurement. <a href="https://policies.google.com/privacy" className="text-gem-gold hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><strong className="text-gem-beige">PostHog Analytics:</strong> Product interaction flow tracking. <a href="https://posthog.com/privacy" className="text-gem-gold hover:underline" target="_blank" rel="noopener noreferrer">PostHog Privacy Policy</a></li>
              <li><strong className="text-gem-beige">ExchangeRate-API & ECB Feeds:</strong> Financial exchange rate data. No personal user identifiers are transmitted.</li>
              <li><strong className="text-gem-beige">Anthropic (Claude AI):</strong> Natural language query understanding. User search prompts sent to the assistant console are processed transiently and are not retained for model training under our enterprise API terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">5. Advertising & Choice Controls</h2>
            <p>To fund ongoing free access, GlobalSync AI displays advertising via Google AdSense. Google and third-party vendors use cookies to serve ads based on prior web visits. You can manage your ad preferences or opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-gem-gold hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices" className="text-gem-gold hover:underline" target="_blank" rel="noopener noreferrer">AboutAds.info</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">6. Data Retention & Security Standards</h2>
            <p>We implement industry-standard encryption (HTTPS / TLS 1.3) across all network traffic. Voluntarily submitted contact emails are stored securely and retained only as long as necessary to fulfill user requests or maintain opt-in communication subscriptions. Standard analytics records are automatically purged according to default retention schedules (26 months for Google Analytics).</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">7. User Rights (GDPR, CCPA & Global Laws)</h2>
            <p>Regardless of your geographic location, GlobalSync AI guarantees the following data rights:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li><strong className="text-gem-beige">Right of Access:</strong> Request a copy of any personal data stored about you.</li>
              <li><strong className="text-gem-beige">Right to Rectification:</strong> Ask us to correct inaccurate or incomplete contact records.</li>
              <li><strong className="text-gem-beige">Right to Erasure ("Right to be Forgotten"):</strong> Request immediate permanent deletion of your email or contact history.</li>
              <li><strong className="text-gem-beige">Right to Object / Opt-Out:</strong> Unsubscribe from product emails at any time using the link in any communication or by emailing us.</li>
            </ul>
            <p className="mt-3">To exercise any privacy right, email our data team directly at <a href="mailto:hello@globalsync-ai.com" className="text-gem-gold hover:underline">hello@globalsync-ai.com</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">8. Children's Privacy Notice</h2>
            <p>GlobalSync AI is designed for working professionals, remote teams, and general web users. We do not intentionally target or collect personal data from children under 13 years of age (or under 16 in the EU). If you believe a minor has submitted personal information, please contact us immediately for deletion.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">9. Policy Modifications</h2>
            <p>We reserve the right to modify this Privacy Policy to reflect technical updates, data provider changes, or legal requirements. Material modifications will be signaled by updating the "Last updated" date at the top of this policy page. Continued use of GlobalSync AI after updates implies acknowledgment of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">10. Privacy Contact & Inquiries</h2>
            <p>For any privacy inquiries, data deletion requests, or regulatory questions, reach out to our privacy officer:</p>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mt-3 text-sm space-y-1">
              <p className="font-medium text-gem-beige">GlobalSync AI Privacy Team</p>
              <p className="text-gem-beige/60">Email: <a href="mailto:hello@globalsync-ai.com" className="text-gem-gold hover:underline">hello@globalsync-ai.com</a></p>
              <p className="text-gem-beige/60">Website: <a href="https://www.globalsync-ai.com" className="text-gem-gold hover:underline">globalsync-ai.com</a></p>
            </div>
          </section>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
