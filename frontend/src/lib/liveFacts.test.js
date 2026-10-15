import { timeIn, zoneAbbr, fillText, nextThursday } from './liveFacts';

test('meeting times follow daylight saving on both sides', () => {
  // Before Europe and the US change clocks (late October 2026).
  expect(timeIn('2026-10-22', 'America/New_York@07:30>Europe/London')).toBe('12:30 PM');
  expect(timeIn('2026-10-22', 'America/New_York@07:30>Asia/Kolkata')).toBe('5:00 PM');
  // After both change (November): New York is an hour further from Mumbai.
  expect(timeIn('2026-11-12', 'America/New_York@07:30>Europe/London')).toBe('12:30 PM');
  expect(timeIn('2026-11-12', 'America/New_York@07:30>Asia/Kolkata')).toBe('6:00 PM');
  // The week between the two changes: London has moved, New York hasn't.
  expect(timeIn('2026-10-29', 'America/New_York@07:30>Europe/London')).toBe('11:30 AM');
});

test('a time that lands on the next calendar day says so', () => {
  expect(timeIn('2026-11-12', 'America/Los_Angeles@07:00>Asia/Tokyo')).toBe('12:00 AM (next day)');
});

test('zone abbreviations match the season', () => {
  expect(zoneAbbr('2026-10-22', 'Europe/London')).toBe('BST');
  expect(zoneAbbr('2026-11-12', 'Europe/London')).toBe('GMT');
  expect(zoneAbbr('2026-11-12', 'America/New_York')).toBe('EST');
  expect(zoneAbbr('2026-11-12', 'Asia/Kolkata')).toBe('IST');
});

test('rate tokens use the live rate and keep the arithmetic consistent', () => {
  const ctx = { day: '2026-10-22', rates: { 'USD:PKR': { rate: 277.02 } }, rateDate: '15 Oct 2026 18:20 UTC' };
  expect(fillText('PKR {fxamt:2500:USD:PKR} at {fx:USD:PKR}/USD on {fxday}', ctx)).toBe('PKR 692,600 at 277.02/USD on 15 Oct 2026');
  expect(fillText('{fxamt:4500:USD:PKR:1}', ctx)).toBe('1,246,590');
  expect(fillText('{fx:USD:XXX}', ctx)).toBe('{fx:USD:XXX}');
});

test('the planning day is always the coming Thursday', () => {
  expect(nextThursday(new Date('2026-10-15T10:00:00Z'))).toBe('2026-10-22');
  expect(nextThursday(new Date('2026-10-19T10:00:00Z'))).toBe('2026-10-22');
});
