/**
 * Standard utility to push custom analytics events to window.dataLayer.
 * Ensures dataLayer is initialized if missing.
 * 
 * @param {string} eventName - The standard custom event name
 * @param {object} params - Additional event payload parameters
 */
export function fireAnalyticsEvent(eventName, params = {}) {
  if (typeof window !== "undefined" && localStorage.getItem("gs_cookie_consent") === "accepted") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });
  }
}
