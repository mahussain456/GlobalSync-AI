import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SEOSingletonHeadGuard
 * 
 * Guards against duplicate tags in document.head that are caused by the combination
 * of static prerendering (e.g. react-snap) and React hydration/Helmet injection.
 * 
 * Deduplicates:
 * - title
 * - meta[name="description"]
 * - meta[name="robots"]
 * - link[rel="canonical"]
 * - meta[property^="og:"] (one per unique property)
 * - meta[name^="twitter:"] (one per unique name)
 * 
 * Rules:
 * - Keeps the latest / page-specific tag.
 * - Prefers tags marked by React Helmet (data-rh="true" or data-react-helmet="true").
 * - Otherwise keeps the last matching tag in document.head.
 * - Safe and idempotent; does not remove unrelated tags.
 */
export default function SEOSingletonHeadGuard() {
  const location = useLocation();

  useEffect(() => {
    let active = true;

    function deduplicateGroup(elements) {
      if (elements.length <= 1) return;
      const arr = Array.from(elements);

      // Prefer tags marked by React Helmet: data-rh="true" or data-react-helmet="true"
      let keepEl = arr.find((el) => {
        const rh = el.getAttribute("data-rh");
        const helmet = el.getAttribute("data-react-helmet");
        return rh === "true" || helmet === "true";
      });

      // Otherwise, keep the last matching tag
      if (!keepEl) {
        keepEl = arr[arr.length - 1];
      }

      // Remove all duplicate siblings
      arr.forEach((el) => {
        if (el !== keepEl && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    }

    function runDeduplication() {
      if (!active) return;

      // 1. Deduplicate <title>
      deduplicateGroup(document.head.querySelectorAll("title"));

      // 2. Deduplicate meta name="description"
      deduplicateGroup(document.head.querySelectorAll('meta[name="description"]'));

      // 3. Deduplicate meta name="robots"
      deduplicateGroup(document.head.querySelectorAll('meta[name="robots"]'));

      // 4. Deduplicate link rel="canonical"
      deduplicateGroup(document.head.querySelectorAll('link[rel="canonical"]'));

      // 5. Deduplicate social tags (Open Graph meta tags by property)
      const ogTags = document.head.querySelectorAll('meta[property^="og:"]');
      const ogGroups = {};
      ogTags.forEach((tag) => {
        const prop = tag.getAttribute("property");
        if (prop) {
          if (!ogGroups[prop]) ogGroups[prop] = [];
          ogGroups[prop].push(tag);
        }
      });
      Object.values(ogGroups).forEach((group) => {
        deduplicateGroup(group);
      });

      // 6. Deduplicate Twitter meta tags by name
      const twitterTags = document.head.querySelectorAll('meta[name^="twitter:"]');
      const twitterGroups = {};
      twitterTags.forEach((tag) => {
        const nameAttr = tag.getAttribute("name");
        if (nameAttr) {
          if (!twitterGroups[nameAttr]) twitterGroups[nameAttr] = [];
          twitterGroups[nameAttr].push(tag);
        }
      });
      Object.values(twitterGroups).forEach((group) => {
        deduplicateGroup(group);
      });
    }

    // Run immediately on route changes
    runDeduplication();

    // Observe head mutations to immediately clean up any dynamically added duplicates
    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tagName = node.tagName.toLowerCase();
              if (tagName === "title" || tagName === "meta" || tagName === "link") {
                shouldRun = true;
                break;
              }
            }
          }
        }
        if (shouldRun) break;
      }

      if (shouldRun) {
        runDeduplication();
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}
