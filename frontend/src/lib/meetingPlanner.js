import { resolveWallTime } from './timeCalculations';

export const DURATIONS = [15, 30, 45, 60, 90, 120];
export const toMinutes = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? Number(value.slice(0, 2)) * 60 + Number(value.slice(3)) : NaN;
export const timeInput = minutes => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export function validatePlan(plan) {
  const day = new Date(`${plan.date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.date) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== plan.date) throw new Error('Choose a valid meeting date.');
  if (!DURATIONS.includes(plan.duration)) throw new Error('Choose a meeting duration from the list.');
  if (plan.cities.length < 2 || plan.cities.length > 5) throw new Error('Choose between two and five cities.');
  for (const city of plan.cities) {
    if (!Number.isInteger(city.start) || !Number.isInteger(city.end) || city.start < 0 || city.end >= 1440 || city.start >= city.end || city.start % 15 || city.end % 15) {
      throw new Error(`For ${city.name}, choose working hours in 15-minute steps with the end after the start. Overnight shifts are not supported.`);
    }
    new Intl.DateTimeFormat('en', { timeZone: city.timezone });
  }
}

// Search the reference city's actual local day (23, 24 or 25 hours at DST).
// Check the entire meeting, not only its starting instant.
export function findMeetingSlots(plan) {
  validatePlan(plan);
  const first = plan.cities[0];
  const midnight = resolveWallTime(plan.date, '00:00', first.timezone);
  const nextDay = new Date(`${plan.date}T12:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const boundary = resolveWallTime(nextDay.toISOString().slice(0, 10), '00:00', first.timezone);
  const formatters = plan.cities.map(city => new Intl.DateTimeFormat('en-GB', { timeZone: city.timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }));
  const available = instant => formatters.every((formatter, i) => {
    const parts = Object.fromEntries(formatter.formatToParts(instant).map(p => [p.type, p.value]));
    const minute = Number(parts.hour) * 60 + Number(parts.minute);
    return (!plan.weekdays || !['Sat', 'Sun'].includes(parts.weekday)) && minute >= plan.cities[i].start && minute < plan.cities[i].end;
  });
  const slots = [];
  for (let start = midnight.getTime(); start + plan.duration * 60000 <= boundary.getTime(); start += 900000) {
    const end = start + plan.duration * 60000;
    let valid = available(new Date(end - 1));
    for (let tick = start; valid && tick < end; tick += 900000) valid = available(new Date(tick));
    if (valid) slots.push({ start: new Date(start), end: new Date(end) });
  }
  return slots;
}

export function meetingSummary(plan, slot) {
  return [`GlobalSync AI meeting · ${plan.duration} minutes`, ...plan.cities.map(city => {
    const date = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(slot.start);
    const time = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
    return `${city.name}: ${date}, ${time.format(slot.start)} – ${time.format(slot.end)}`;
  })].join('\n');
}

const icsDate = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeICS = value => String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
// RFC 5545: fold content lines at 75 octets without splitting UTF-8 characters.
function foldLine(line) {
  let result = '', width = 0;
  for (const character of line) {
    const bytes = unescape(encodeURIComponent(character)).length;
    if (width + bytes > 75) { result += '\r\n '; width = 1; }
    result += character; width += bytes;
  }
  return result;
}
export function calendarFile(plan, slot, now = new Date()) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GlobalSync AI//Meeting Planner//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${slot.start.getTime()}-${plan.duration}-${plan.cities.map(c => encodeURIComponent(c.name)).join('-')}@globalsync-ai.com`,
    `DTSTAMP:${icsDate(now)}`, `DTSTART:${icsDate(slot.start)}`, `DTEND:${icsDate(slot.end)}`,
    'SUMMARY:GlobalSync AI meeting', `DESCRIPTION:${escapeICS(meetingSummary(plan, slot))}`,
    'END:VEVENT', 'END:VCALENDAR'].map(foldLine).join('\r\n') + '\r\n';
}
export function googleCalendarLink(plan, slot) {
  const params = new URLSearchParams({ action: 'TEMPLATE', text: 'GlobalSync AI meeting', dates: `${icsDate(slot.start)}/${icsDate(slot.end)}`, details: meetingSummary(plan, slot) });
  return `https://calendar.google.com/calendar/render?${params}`;
}
export function serializePlan(plan, selectedStart = '') {
  return new URLSearchParams({ date: plan.date, duration: String(plan.duration), cities: plan.cities.map(c => c.name).join('|'), hours: plan.cities.map(c => `${timeInput(c.start)}-${timeInput(c.end)}`).join('|'), weekdays: plan.weekdays ? '1' : '0', ...(selectedStart ? { start: selectedStart } : {}) }).toString();
}
export function readSharedPlan(search, cityMap) {
  if (!search) return null;
  const params = new URLSearchParams(search);
  if (!params.has('cities')) return null;
  if (search.length > 2500) throw new Error('This shared plan is too long. Create a new plan below.');
  const names = params.get('cities').split('|');
  if (new Set(names).size !== names.length) throw new Error('This link repeats a city. Create a new plan below.');
  const hours = (params.get('hours') || '').split('|');
  const cities = names.map((name, i) => {
    if (!cityMap[name]) throw new Error('This link contains an unsupported city. Choose cities below.');
    const [start, end] = (hours[i] || '09:00-17:00').split('-');
    return { name, timezone: cityMap[name], start: toMinutes(start), end: toMinutes(end) };
  });
  const plan = { cities, date: params.get('date'), duration: Number(params.get('duration') || 30), weekdays: params.get('weekdays') !== '0' };
  validatePlan(plan);
  return { plan, selectedStart: params.get('start') || '' };
}
