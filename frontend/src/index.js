import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";

const rootElement = document.getElementById("root");

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// react-snap pre-renders pages to static HTML.
// When the pre-rendered HTML is served, rootElement already has children —
// use hydrateRoot so React attaches event handlers without re-rendering.
// In normal CSR mode (no pre-rendered HTML), use createRoot as usual.
// Wrap hydrateRoot in try/catch so a hydration mismatch never leaves a blank page.
if (rootElement.hasChildNodes()) {
  try {
    hydrateRoot(rootElement, app);
  } catch (e) {
    // Hydration failed (mismatched pre-rendered HTML) — fall back to full CSR
    console.error("[GlobalSync] hydrateRoot failed, falling back to createRoot:", e);
    rootElement.innerHTML = "";
    createRoot(rootElement).render(app);
  }
} else {
  createRoot(rootElement).render(app);
}
