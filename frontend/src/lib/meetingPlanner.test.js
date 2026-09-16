import { findMeetingSlots, calendarFile, googleCalendarLink, serializePlan, readSharedPlan, validatePlan } from './meetingPlanner';
import { CITY_TIMEZONES } from './cityTimezones';

const city = (name, start = 540, end = 1020) => ({ name, timezone: CITY_TIMEZONES[name], start, end });
const plan = patch => ({ date: '2026-09-16', duration: 30, weekdays: true, cities: [city('New York'), city('London')], ...patch });

test('offers only full-duration meetings inside both working days', () => {
  const slots = findMeetingSlots(plan());
  expect(slots).toHaveLength(11);
  expect(slots[0].start.toISOString()).toBe('2026-09-16T13:00:00.000Z');
  expect(slots.at(-1).end.toISOString()).toBe('2026-09-16T16:00:00.000Z');
  expect(findMeetingSlots(plan({ duration: 120 })).at(-1).start.toISOString()).toBe('2026-09-16T14:00:00.000Z');
});
test('custom working hours change the available range', () => {
  expect(findMeetingSlots(plan({ cities: [city('New York'), city('London', 540, 1080)] })).at(-1).end.toISOString()).toBe('2026-09-16T17:00:00.000Z');
});
test('returns no overlap for New York and Mumbai standard hours', () => {
  expect(findMeetingSlots(plan({ cities: [city('New York'), city('Mumbai')] }))).toEqual([]);
});
test('weekend filter can be disabled', () => {
  expect(findMeetingSlots(plan({ date: '2026-09-19' }))).toEqual([]);
  expect(findMeetingSlots(plan({ date: '2026-09-19', weekdays: false }))).toHaveLength(11);
});
test('reference local day may start on the previous UTC date', () => {
  const slots = findMeetingSlots(plan({ cities: [city('Sydney'), city('Auckland')] }));
  expect(slots[0].start.toISOString()).toBe('2026-09-15T23:00:00.000Z');
});
test('uses date-specific DST offsets', () => {
  const options = { weekdays: false, cities: [city('New York', 720), city('Toronto', 720)] };
  expect(findMeetingSlots(plan({ ...options, date: '2026-10-31' }))[0].start.toISOString()).toBe('2026-10-31T16:00:00.000Z');
  expect(findMeetingSlots(plan({ ...options, date: '2026-11-01' }))[0].start.toISOString()).toBe('2026-11-01T17:00:00.000Z');
});
test('rejects invalid dates and overnight or non-quarter-hour shifts', () => {
  expect(() => validatePlan(plan({ date: '2026-02-30' }))).toThrow('valid meeting date');
  expect(() => validatePlan(plan({ cities: [city('London', 1020, 540), city('New York')] }))).toThrow('Overnight');
  expect(() => validatePlan(plan({ cities: [city('London', 541), city('New York')] }))).toThrow('15-minute');
});
test('shared links preserve date, hours, duration, weekend choice and selected time', () => {
  const original = plan({ duration: 60, weekdays: false, cities: [city('New York', 480), city('London', 600, 1080)] });
  const selectedStart = findMeetingSlots(original)[1].start.toISOString();
  expect(readSharedPlan(serializePlan(original, selectedStart), CITY_TIMEZONES)).toEqual({ plan: original, selectedStart });
  expect(() => readSharedPlan('?cities=Unknown|London&date=2026-09-16', CITY_TIMEZONES)).toThrow('unsupported city');
});
test('calendar exports and Google draft contain the exact UTC interval', () => {
  const original = plan(), slot = findMeetingSlots(original)[0];
  const ics = calendarFile(original, slot, new Date('2026-09-16T00:00Z'));
  expect(ics).toContain('DTSTART:20260916T130000Z\r\nDTEND:20260916T133000Z');
  expect(ics).toContain('DTSTAMP:20260916T000000Z');
  expect(ics).toContain('\\nLondon:');
  ics.split('\r\n').forEach(line => expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75));
  expect(new URL(googleCalendarLink(original, slot)).searchParams.get('dates')).toBe('20260916T130000Z/20260916T133000Z');
});
