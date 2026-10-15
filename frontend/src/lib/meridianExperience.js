// Homepage "slide through a day" demo: three preset city groups and a time slider.
// It only shows how a day lines up. Real planning (custom cities, working-hours
// overlap, calendar files) lives on /meeting-planner, and the hero holds the
// quick converter, so this file no longer drives a planner of its own.
import { nextWeekday } from './meetingPlanner';

export function initializeMeridian(root) {
  const controller = new AbortController();
  const listen = (target, type, fn) => target && target.addEventListener(type, fn, { signal: controller.signal });
  const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
  const groups = {
    atlantic: [['New York', 'America/New_York'], ['London', 'Europe/London'], ['Berlin', 'Europe/Berlin']],
    asia: [['London', 'Europe/London'], ['Dubai', 'Asia/Dubai'], ['Singapore', 'Asia/Singapore']],
    pacific: [['Los Angeles', 'America/Los_Angeles'], ['Tokyo', 'Asia/Tokyo'], ['Sydney', 'Australia/Sydney']]
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let group = 'atlantic', tick = 52, paused = reduced.matches;
  // On a weekend, "today" would show everyone off work. Use the next weekday.
  const selectedDate = nextWeekday(new Date().toISOString().slice(0, 10));
  const formatters = new Map();
  const local = (d, tz) => {
    if (!formatters.has(tz)) formatters.set(tz, new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }));
    return formatters.get(tz).format(d);
  };
  const moment = () => new Date(new Date(selectedDate + 'T00:00:00Z').getTime() + tick * 15 * 60000);
  const dateLabel = tz => new Intl.DateTimeFormat('en-GB', { timeZone: tz, day: 'numeric', month: 'short' }).format(moment());
  const minutes = (d, tz) => { const [h, m] = local(d, tz).split(':').map(Number); return h * 60 + m; };
  const working = tz => { const m = minutes(moment(), tz); return m >= 540 && m < 1020; };

  function update() {
    const row = $('[data-clock-row]');
    if (!row) return;
    $$('.range').forEach(el => { el.value = tick; el.setAttribute('aria-valuetext', local(moment(), 'UTC') + ' UTC'); });
    $$('[data-utc]').forEach(el => { el.textContent = local(moment(), 'UTC') + ' UTC'; });
    $$('[data-date-label]').forEach(el => { el.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }).format(moment()); });
    row.innerHTML = groups[group].map(([name, tz]) => `<div>${name}<span>${local(moment(), tz)}</span><small>${dateLabel(tz)} · ${working(tz) ? 'Within working hours' : 'Outside working hours'}</small><div class="city-track" aria-hidden="true"><i></i><b style="--day:${minutes(moment(), tz) / 14.4}%"></b></div></div>`).join('');
    $$('[data-group]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.group === group)));
  }
  $$('.range').forEach(el => listen(el, 'input', () => { tick = Number(el.value); update(); }));
  $$('[data-group]').forEach(el => listen(el, 'click', () => { group = el.dataset.group; update(); }));

  const toggle = $('.motion-toggle');
  function motionState() {
    root.classList.toggle('pause', paused);
    if (toggle) { toggle.textContent = paused ? 'Motion paused' : 'Pause motion'; toggle.setAttribute('aria-pressed', String(paused)); }
  }
  listen(toggle, 'click', () => { paused = !paused; motionState(); });
  const mediaChange = e => { paused = e.matches; motionState(); };
  reduced.addEventListener('change', mediaChange);
  motionState();
  update();
  return () => { controller.abort(); reduced.removeEventListener('change', mediaChange); };
}
