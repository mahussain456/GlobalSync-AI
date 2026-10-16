// ─── Social proof: the ONLY place homepage proof numbers and quotes come from ──
//
// TODO(owner): Replace each `null` with REAL, verifiable data, then redeploy.
//   - Usage stats: take them from GA4 / PostHog (e.g. "invoices downloaded in the
//     last 30 days"). Put where the number came from in `source` so it can be checked.
//   - Testimonials: only quotes from real users who gave written permission to be
//     named. Set `permission: true` once you have that permission on file.
// Never invent numbers, names, quotes, logos or press mentions. An empty slot
// is simply not shown, so nothing fake can ever reach the site.

export const SOCIAL_PROOF = {
  // Usage stats. `value` is a display string such as "12,400".
  usageStats: [
    { label: "Meeting times planned", value: null, source: "" }, // PLACEHOLDER
    { label: "Invoices downloaded", value: null, source: "" }, // PLACEHOLDER
    { label: "Currency conversions", value: null, source: "" }, // PLACEHOLDER
  ],

  // Up to three testimonials. All fields required, and `permission` must be true.
  testimonials: [
    { quote: null, name: null, role: null, permission: false }, // PLACEHOLDER
    { quote: null, name: null, role: null, permission: false }, // PLACEHOLDER
    { quote: null, name: null, role: null, permission: false }, // PLACEHOLDER
  ],

  // Facts about the product itself. These are true today and checkable in the
  // code and data; keep them in sync if the product changes.
  productFacts: [
    { value: "160+", label: "currencies, live rates refreshed every minute" },
    { value: "85+", label: "cities in the time zone tools" },
    { value: "12", label: "freelance rate corridors" },
    { value: "0", label: "signups needed to use any tool" },
  ],
};

export const realStats = () => SOCIAL_PROOF.usageStats.filter((s) => s.value);
export const realTestimonials = () =>
  SOCIAL_PROOF.testimonials.filter((t) => t.quote && t.name && t.permission);
