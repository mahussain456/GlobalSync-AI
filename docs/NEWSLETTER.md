# Newsletter signup: owner setup

The site has a "Weekly remote-work tips" signup at the bottom of the homepage and at the end of every guide
(`frontend/src/components/NewsletterSignup.js`). It's a plain HTML form that posts straight to your email
provider. **No API key is used or stored anywhere**, and the site keeps no copy of the address.

Until you finish step 2, the form is **hidden on the live site** (so there's never a form that goes nowhere).
In local development it shows a dashed "not live yet" note instead.

## 1. Pick a provider and get its form URL

| Provider | Where to find the form URL | Email field name |
|----------|----------------------------|------------------|
| Buttondown | `https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME` (Settings → Embedding) | `email` |
| Kit (ConvertKit) | Grow → Landing Pages & Forms → your form → Embed → HTML. Copy the `<form action="…">` URL, e.g. `https://app.kit.com/forms/1234567/subscriptions` | `email_address` |
| Mailchimp | Audience → Signup forms → Embedded forms. Copy the `<form action="…">` URL (it contains `list-manage.com`) | `EMAIL` |

Turn on **double opt-in** in the provider. The form already asks for explicit, unticked consent and links the Privacy Policy.

## 2. Set two environment variables in Vercel

Vercel → project `global-sync-ai` → Settings → Environment Variables (Production and Preview):

```
REACT_APP_NEWSLETTER_ACTION=<the form URL from step 1>
REACT_APP_NEWSLETTER_EMAIL_FIELD=<email | email_address | EMAIL>
```

Then redeploy (Deployments → … → Redeploy). These are build-time variables, so a redeploy is required.

## 3. If you use a provider not listed above

The site's Content-Security-Policy only allows forms to post to the three providers above. Add your provider's
form domain to the `form-action` list in **both** `vercel.json` and `frontend/vercel.json`
(the `/((?!embed/).*)` header rule).

## 4. Name the provider in the Privacy Policy

`frontend/src/pages/PrivacyPolicyPage.js` says "our email service provider". Once you've chosen one, replace that
with its name and link its privacy policy.

## What the subscriber is promised

Edit `promise` in `frontend/src/config/newsletter.js`. Today it says: one email a week, one practical tip, no spam,
one-click unsubscribe. Only promise what you'll actually send.
