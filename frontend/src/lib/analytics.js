/**
 * Standard utility to push custom analytics events to window.dataLayer.
 * Ensures dataLayer is initialized if missing.
 * 
 * @param {string} eventName - The standard custom event name
 * @param {object} params - Additional event payload parameters
 */
export function fireAnalyticsEvent(eventName, params = {}) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });
  }
}
