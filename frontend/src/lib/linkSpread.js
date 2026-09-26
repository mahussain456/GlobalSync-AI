/**
 * Spread "related" links evenly across a set of sibling pages.
 *
 * The related-pair lists used to filter candidates in a fixed order and take
 * the first few. Pairs near the front of that order were linked from nearly
 * every sibling while pairs at the back were linked from none, leaving ~150
 * pages with a single inbound link (their hub). Rotating the candidate list by
 * a hash of the current page spreads the links across the whole set.
 *
 * Deterministic on purpose: the same page must produce the same links on every
 * render, or the pre-rendered HTML and the hydrated page would disagree.
 */
export function rotateBySeed(list, seed) {
  if (list.length < 2) return list;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const offset = hash % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}
