import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const rootElement = document.getElementById("root");

// The build snapshot stays useful without JavaScript. Replace it on startup;
// never hydrate a hand-built or time-dependent DOM as if it were a React tree.
//
// React 19 hoists <title>, <meta> and <link> into <head> itself, and it does
// not adopt the equivalents the pre-renderer already baked in — it appends a
// second copy. So every tag SEOHead owns is marked data-seo and removed here
// before React writes its own. Dropping this line puts two titles, two meta
// descriptions and two canonicals on all 379 pages, and none of it is visible
// to curl, because the duplicate only appears once this script has run.
document.querySelectorAll("[data-seo]").forEach(node => node.remove());

rootElement.replaceChildren();
createRoot(rootElement).render(app);
