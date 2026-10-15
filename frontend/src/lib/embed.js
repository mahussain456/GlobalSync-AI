// Shared settings for the embeddable world clock (/embed/world-clock) and its
// builder page (/embed). Everything a host site can change is a URL parameter.
import { CITY_TIMEZONES, CITY_NAMES } from "@/lib/cityTimezones";

export const SITE = "https://www.globalsync-ai.com";
export const EMBED_PATH = "/embed/world-clock";
export const EMBED_CITIES = CITY_NAMES;
export const DEFAULT_CITIES = ["New York", "London", "Dubai", "Singapore"];
export const MAX_EMBED_CITIES = 4;

export const SIZES = {
  compact: { label: "Compact (280 px)", width: "280" },
  standard: { label: "Standard (360 px)", width: "360" },
  full: { label: "Full width", width: "100%" },
};

// Height grows with the number of cities, so the iframe never needs a scrollbar.
export const embedHeight = (count) => 64 + count * 58 + 40;

export function parseEmbedParams(search) {
  const params = new URLSearchParams(search);
  const cities = (params.get("cities") || "")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => CITY_TIMEZONES[c] && !/^[A-Z]{2,4}$/.test(c));
  return {
    cities: [...new Set(cities)].slice(0, MAX_EMBED_CITIES).length ? [...new Set(cities)].slice(0, MAX_EMBED_CITIES) : DEFAULT_CITIES,
    theme: params.get("theme") === "dark" ? "dark" : "light",
    hour12: params.get("format") === "12",
  };
}

export function embedUrl({ cities, theme, hour12 }) {
  const params = new URLSearchParams({ cities: cities.join(","), theme });
  if (hour12) params.set("format", "12");
  return `${SITE}${EMBED_PATH}?${params.toString().replace(/%2C/g, ",").replace(/\+/g, "%20")}`;
}

export function embedSnippet(opts, size) {
  const width = SIZES[size].width;
  const style = `border:0;width:${width === "100%" ? "100%" : width + "px"};max-width:100%;height:${embedHeight(opts.cities.length)}px`;
  return `<iframe src="${embedUrl(opts)}" title="World clock by GlobalSync AI" loading="lazy" style="${style}"></iframe>`;
}
