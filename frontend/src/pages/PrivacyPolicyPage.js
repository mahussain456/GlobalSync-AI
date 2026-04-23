import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const LAST_UPDATED = "March 2026";

export default function PrivacyPolicyPage() {
  const seo = getStaticPageSEO("privacy-policy");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-zinc-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-zinc-400">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 mb-8 text-sm text-blue-800">
          <strong>Summary:</strong> GlobalSync AI is a free tool. We collect minimal data, do not sell your information, and use standard analytics to improve the service.
        </div>

        <div className="space-y-8 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">1. Who We Are</h2>
            <p>GlobalSync AI (<strong>globalsync-ai.com</strong>) is a free online toolkit providing time zone conversion, currency conversion, and meeting planning tools for remote teams and global workers. When we say "we", "our", or "us" in this policy, we mean GlobalSync AI.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">2. Information We Collect</h2>
            <h3 className="font-semibold text-zinc-800 mb-2">2a. Information You Provide Voluntarily</h3>
            <p className="mb-3">When you use our optional onboarding form, you may choose to provide:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Your name</li>
              <li>Your email address</li>
            </ul>
            <p className="mt-3">This is entirely optional and can be skipped. We use this information to understand our user base and may send product updates if you opt in.</p>

            <h3 className="font-semibold text-zinc-800 mb-2 mt-5">2b. Information Collected Automatically</h3>
            <p className="mb-3">When you visit GlobalSync AI, we automatically collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Usage data:</strong> Pages visited, features used, queries entered (anonymised)</li>
              <li><strong>Device data:</strong> Browser type, operating system, screen size</li>
              <li><strong>Technical data:</strong> IP address (anonymised), referral source, session duration</li>
            </ul>

            <h3 className="font-semibold text-zinc-800 mb-2 mt-5">2c. Cookies</h3>
            <p>We use cookies and similar tracking technologies for:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li><strong>Analytics cookies (Google Analytics):</strong> To understand how visitors use our site, measure traffic, and improve the user experience.</li>
              <li><strong>Functional cookies:</strong> To remember your preferences (e.g., skipping the onboarding modal).</li>
            </ul>
            <p className="mt-3">You can disable cookies in your browser settings. Note that some functionality may be affected.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Provide and improve our conversion tools</li>
              <li>Analyse usage patterns to enhance user experience</li>
              <li>Send occasional product updates (only if you provided your email)</li>
              <li>Detect and prevent abuse of our free API services</li>
              <li>Display relevant advertising (Google AdSense — see section 5)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">4. Third-Party Services</h2>
            <p>GlobalSync AI uses the following third-party services, each with their own privacy policies:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm mt-3">
              <li><strong>Google Analytics (Google LLC):</strong> Website analytics and traffic measurement. <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><strong>ExchangeRate-API:</strong> Live currency exchange rate data. No personal data is shared.</li>
              <li><strong>Frankfurter API (European Central Bank):</strong> Historical currency trend data. No personal data is shared.</li>
              <li><strong>Anthropic (Claude AI):</strong> Natural language query processing. Queries are processed but not stored by Anthropic under our usage terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">5. Advertising</h2>
            <p>GlobalSync AI may display advertisements served by Google AdSense. Google uses cookies to serve ads based on your prior visits to our website and other sites. You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">6. Data Retention</h2>
            <p>We retain voluntarily submitted email addresses until you request deletion. Analytics data is retained as per Google Analytics default retention settings (26 months). You may request deletion of your data at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:hello@globalsync-ai.com" className="text-blue-600 hover:underline">hello@globalsync-ai.com</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">8. Children's Privacy</h2>
            <p>GlobalSync AI is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Continued use of GlobalSync AI after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <div className="bg-zinc-50 rounded-xl p-4 mt-3 text-sm">
              <p className="font-medium text-zinc-800">GlobalSync AI</p>
              <p className="text-zinc-500">Email: <a href="mailto:hello@globalsync-ai.com" className="text-blue-600 hover:underline">hello@globalsync-ai.com</a></p>
              <p className="text-zinc-500">Website: <a href="https://globalsync-ai.com" className="text-blue-600 hover:underline">globalsync-ai.com</a></p>
            </div>
          </section>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
