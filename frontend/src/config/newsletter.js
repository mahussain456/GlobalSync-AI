// ─── Newsletter signup: where the form posts ──────────────────────────────────
//
// TODO(owner): pick an email provider and set these two environment variables in
// Vercel (Project → Settings → Environment Variables), then redeploy. No API key
// is needed: every provider below accepts a plain HTML form post.
//
//   REACT_APP_NEWSLETTER_ACTION       the provider's form URL
//   REACT_APP_NEWSLETTER_EMAIL_FIELD  the name of its email field
//
//   Buttondown   https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME   field: email
//   Kit (ConvertKit)  https://app.kit.com/forms/YOUR_FORM_ID/subscriptions          field: email_address
//   Mailchimp    the <form action="..."> URL from Audience → Signup forms → Embedded   field: EMAIL
//
// Until REACT_APP_NEWSLETTER_ACTION is set, the signup box is hidden in production
// (no form that silently goes nowhere) and shows a setup note in development.
// Full steps: docs/NEWSLETTER.md

export const NEWSLETTER = {
  action: process.env.REACT_APP_NEWSLETTER_ACTION || "",
  emailField: process.env.REACT_APP_NEWSLETTER_EMAIL_FIELD || "email",
  // What subscribers get and how often. Shown next to the form. Keep it true.
  promise: "One email a week with one practical tip for working across time zones and currencies. No spam. Unsubscribe in one click.",
};

export const newsletterConfigured = () => /^https:\/\//.test(NEWSLETTER.action);
