import { getUTCOffsetMinutes } from "./timezoneUtils";

export const ABBREVIATION_OFFSETS = { UTC: 0, GMT: 0, EST: -300, EDT: -240, CST: -360, CDT: -300, MST: -420, MDT: -360, PST: -480, PDT: -420, IST: 330, CET: 60, CEST: 120, BST: 60, AEST: 600, JST: 540, SGT: 480, PHT: 480, PKT: 300, GST: 240, BRT: -180, NZST: 720 };

export function convertFixedTime(date, time, from, to) {
  if (!(from in ABBREVIATION_OFFSETS) || !(to in ABBREVIATION_OFFSETS)) throw new Error("Unknown time abbreviation");
  const wall = new Date(`${date}T${time}:00Z`);
  const converted = new Date(wall.getTime() + (ABBREVIATION_OFFSETS[to] - ABBREVIATION_OFFSETS[from]) * 60000);
  if (!Number.isFinite(converted.getTime())) throw new Error("Enter a valid date and time");
  return { toTime: converted.toLocaleTimeString("en-US", {timeZone: "UTC", hour: "2-digit", minute: "2-digit"}),
    toDateStr: converted.toLocaleDateString("en-US", {timeZone: "UTC", weekday: "short", month: "short", day: "numeric", year: "numeric"}),
    dayDiff: Math.floor(converted.getTime() / 86400000) - Math.floor(wall.getTime() / 86400000) };
}

export function resolveWallTime(date, time, zone) {
  let hour, minute;
  const match = String(time).match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (/^noon$/i.test(time)) { hour = 12; minute = 0; }
  else if (/^midnight$/i.test(time)) { hour = 0; minute = 0; }
  else if (match) {
    hour = Number(match[1]); minute = Number(match[2] || 0);
    if (match[3]) { if (hour < 1 || hour > 12) throw new Error("Enter an hour between 1 and 12"); hour = hour % 12 + (/pm/i.test(match[3]) ? 12 : 0); }
  } else throw new Error("Use a time such as 15:00 or 3 PM");
  if (hour > 23 || minute > 59) throw new Error("Enter a valid time");
  const wall = new Date(`${date}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00Z`);
  if (!Number.isFinite(wall.getTime()) || wall.toISOString().slice(0,10) !== date) throw new Error("Enter a valid date");
  const offsets = new Set([-86400000, 0, 86400000].map(delta => getUTCOffsetMinutes(zone, new Date(wall.getTime() + delta))));
  const candidates = [...offsets].map(offset => new Date(wall.getTime() - offset * 60000))
    .filter(instant => instant.getTime() + getUTCOffsetMinutes(zone, instant) * 60000 === wall.getTime());
  if (candidates.length === 0) throw new Error("That local time does not exist because the clocks move forward. Choose another time.");
  if (candidates.length > 1) throw new Error("That local time occurs twice when the clocks move back. Choose an unambiguous time.");
  return candidates[0];
}

// Each quarter-hour represents [start, end); 17:00 is outside a 09:00–17:00 day.
// Separate UTC windows are kept separate, including windows across midnight.
export function meetingWindows(zones, date = new Date(), startHour = 9, endHour = 17) {
  if (zones.length < 2 || startHour < 0 || endHour > 24 || startHour >= endHour) return [];
  const midnight = new Date(date); midnight.setUTCHours(0,0,0,0);
  const formatters = zones.map(timeZone => new Intl.DateTimeFormat('en-GB', { timeZone, hour:'2-digit', minute:'2-digit', hourCycle:'h23' }));
  const windows = [];
  for (let tick = 0; tick < 96; tick++) {
    const instant = new Date(midnight.getTime() + tick * 15 * 60000);
    const match = formatters.every(formatter => { const [h,m] = formatter.format(instant).split(':').map(Number); const local=h+m/60; return local >= startHour && local < endHour; });
    if (!match) continue;
    const last = windows[windows.length - 1];
    if (last && last.endTick === tick) last.endTick = tick + 1;
    else windows.push({startTick: tick, endTick: tick + 1});
  }
  return windows.map(w => ({ ...w, start: new Date(midnight.getTime() + w.startTick * 900000), end: new Date(midnight.getTime() + w.endTick * 900000), minutes: (w.endTick-w.startTick)*15 }));
}
