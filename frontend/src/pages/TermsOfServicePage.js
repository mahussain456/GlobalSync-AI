import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const LAST_UPDATED = "March 2026";

export default function TermsOfServicePage() {
  const seo = getStaticPageSEO("terms-of-service");
  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gem-beige mb-3">Terms of Service</h1>
          <p className="text-sm text-gem-beige/40">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 mb-8 text-sm text-gem-beige/80">
          <strong className="text-gem-beige">Please read these Terms carefully.</strong> By using GlobalSync AI, you agree to be bound by these Terms. If you do not agree, please do not use our services.
        </div>

        <div className="space-y-8 text-gem-beige/70 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using GlobalSync AI at <strong className="text-gem-beige">globalsync-ai.com</strong> (the "Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms apply to all visitors, users, and others who access the Service.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">2. Description of Service</h2>
            <p>GlobalSync AI provides free online tools for:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Time zone conversion and world clock display</li>
              <li>Currency conversion with live exchange rates</li>
              <li>Meeting time planning and business hour overlap calculation</li>
              <li>AI-powered natural language query processing</li>
            </ul>
            <p className="mt-3">The Service is provided free of charge and does not require registration or account creation.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">3. Accuracy of Information</h2>
            <p>GlobalSync AI provides conversion tools for informational purposes only. While we strive to ensure accuracy:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li><strong className="text-gem-beige">Exchange rates</strong> are sourced from third-party APIs and may not reflect real-time market rates or the rates offered by banks and financial institutions.</li>
              <li><strong className="text-gem-beige">Time zone data</strong> relies on the IANA Time Zone Database and may not account for recent government changes to daylight saving time rules.</li>
              <li><strong className="text-gem-beige">We are not responsible</strong> for any financial, legal, or business decisions made based on information provided by this Service.</li>
            </ul>
            <p className="mt-3">Always verify critical information with official sources before making financial or legal decisions.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure</li>
              <li>Use automated scripts, bots, or scraping tools to access the Service in excess of reasonable usage</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service</li>
              <li>Resell or commercially exploit the Service or its API without written permission</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">5. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by GlobalSync AI and are protected by applicable copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, or create derivative works based on the Service without prior written permission.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">6. Third-Party Services</h2>
            <p>The Service integrates with third-party APIs and services including ExchangeRate-API, Frankfurter API, and Anthropic AI. These services operate independently and their availability is not guaranteed. We are not liable for any disruption or inaccuracy arising from third-party services.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">7. Disclaimer of Warranties</h2>
            <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY ACCURATE. USE OF THE SERVICE IS AT YOUR SOLE RISK.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">8. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GLOBALSYNC AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO FINANCIAL LOSSES ARISING FROM CURRENCY CONVERSION DECISIONS.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">9. Rate Limiting</h2>
            <p>To ensure fair access for all users, the Service implements automated rate limiting on its APIs. Excessive automated use may result in temporary access restrictions. Commercial use of the API requires prior written agreement.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page, with the "Last updated" date revised accordingly. Your continued use of the Service after any changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">11. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:hello@globalsync-ai.com" className="text-gem-gold hover:underline">hello@globalsync-ai.com</a>.</p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
