/**
 * Send consented events through the site's Google tag (not a GTM container).
 * Never include queries, email addresses or invoice details in event parameters.
 * 
 * @param {string} eventName - The standard custom event name
 * @param {object} params - Additional event payload parameters
 */
export function fireAnalyticsEvent(eventName, params = {}) {
  try {
  if (typeof window !== "undefined" && localStorage.getItem("gs_cookie_consent") === "accepted") {
    window.dataLayer = window.dataLayer || [];
    const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag('event', eventName, params);
  }
  } catch { /* Optional measurement must never interrupt a tool. */ }
}
