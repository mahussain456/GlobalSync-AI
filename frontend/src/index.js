import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import App from "@/App";

// HelmetProvider is required for react-helmet-async (used by SEOHead).
// It must wrap the entire app so every SEOHead can register with the same context.
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

const rootElement = document.getElementById("root");

// Determine whether to hydrate (react-snap prerender) or do a fresh CSR mount.
//
// Two possible cases when rootElement already has children:
//   A) react-snap ran successfully → the inner HTML is a real React tree.
//      We can safely call hydrateRoot — React will attach event listeners
//      without re-rendering, giving us zero-flash SSG hydration.
//   B) react-snap failed on the CI server (e.g. Vercel has no Chrome) →
//      run-snap-with-info.js wrote a static fallback template with
//      data-gs-fallback="1" on the wrapper div. This is NOT a React tree.
//      Calling hydrateRoot on it triggers React error #418, corrupts the
//      component tree, and prevents useEffect hooks from running (no rate fetch).
//      Solution: wipe the non-React HTML and use createRoot for a fresh CSR render.
//
const isReactSnapOutput = rootElement.hasChildNodes() &&
  !rootElement.querySelector('[data-gs-fallback]');

if (isReactSnapOutput) {
  // Real react-snap prerender — hydrate without re-rendering.
  hydrateRoot(rootElement, app);
} else {
  // Either empty shell (no prerender) or non-React fallback snapshot.
  // Clear any fallback HTML so React starts with a clean DOM.
  rootElement.innerHTML = "";
  createRoot(rootElement).render(app);
}
