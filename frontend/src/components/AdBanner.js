import { useEffect, useRef } from "react";

// Replace these slot IDs with your real AdSense ad unit IDs from your AdSense dashboard.
// Go to: AdSense → Ads → By ad unit → Create new ad unit → get the data-ad-slot value.
export const AD_SLOTS = {
  leaderboard:  "REPLACE_WITH_SLOT_ID", // 728x90 / responsive leaderboard — use after H1
  rectangle:    "REPLACE_WITH_SLOT_ID", // 300x250 / responsive rectangle — use between sections
};

const PUBLISHER_ID = "ca-pub-3241670070120503";
const IS_PLACEHOLDER = AD_SLOTS.leaderboard === "REPLACE_WITH_SLOT_ID";

/**
 * AdBanner — renders a responsive Google AdSense unit.
 * @param {string} slot  - one of the keys from AD_SLOTS above
 * @param {string} format - "auto" (default) | "rectangle" | "horizontal"
 * @param {string} className - optional extra classes for the wrapper div
 */
export default function AdBanner({ slot = "leaderboard", format = "auto", className = "" }) {
  const adRef = useRef(null);
  const slotId = AD_SLOTS[slot] || AD_SLOTS.leaderboard;

  useEffect(() => {
    if (IS_PLACEHOLDER) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // silently ignore duplicate push errors
    }
  }, [slotId]);

  // Show a subtle placeholder until real slot IDs are added
  if (IS_PLACEHOLDER) {
    return (
      <div className={`w-full flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-gem-forest text-zinc-400 text-xs py-3 my-2 ${className}`}>
        Ad placeholder — add your AdSense slot ID in <code className="mx-1 font-mono bg-white/5 px-1 rounded">AdBanner.js</code>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
