// Homepage motion control. The tool stage revolves and animates; this wires the
// page's "Pause motion" button (required for auto-moving content) and follows the
// visitor's reduced-motion setting. Paused state adds .pause to the page root,
// which the stage, dial and glass styles all respect.

export function initializeMeridian(root) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = root.querySelector(".motion-toggle");
  let paused = reduced.matches;
  const render = () => {
    root.classList.toggle("pause", paused);
    if (toggle) { toggle.textContent = paused ? "Play motion" : "Pause motion"; toggle.setAttribute("aria-pressed", String(paused)); }
  };
  const onClick = () => { paused = !paused; render(); };
  const onMedia = (e) => { paused = e.matches; render(); };
  toggle?.addEventListener("click", onClick);
  reduced.addEventListener("change", onMedia);
  render();
  return () => { toggle?.removeEventListener("click", onClick); reduced.removeEventListener("change", onMedia); };
}
