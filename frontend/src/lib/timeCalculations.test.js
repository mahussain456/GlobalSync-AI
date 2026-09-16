import { convertFixedTime, resolveWallTime, meetingWindows } from './timeCalculations';
import { getUTCOffsetMinutes, computeBusinessOverlap } from './timezoneUtils';
import { localParseQuery } from './parseQuery';

test('summer New York and London overlap ends at 16:00 UTC, excluding 17:00 London', () => {
  const windows = meetingWindows(['America/New_York', 'Europe/London'], new Date('2026-09-15T12:00:00Z'));
  expect(windows).toHaveLength(1);
  expect(windows[0].start.toISOString()).toBe('2026-09-15T13:00:00.000Z');
  expect(windows[0].end.toISOString()).toBe('2026-09-15T16:00:00.000Z');
  expect(windows[0].minutes).toBe(180);
});

test.each(['2026-01-15', '2026-09-15'])('New York and India have no 9–5 overlap on %s', date => {
  expect(meetingWindows(['America/New_York', 'Asia/Kolkata'], new Date(date))).toEqual([]);
});

test('overlap across UTC midnight is returned as separate valid windows', () => {
  const windows = meetingWindows(['Pacific/Auckland', 'Australia/Sydney'], new Date('2026-09-15'));
  expect(windows).toHaveLength(2);
  expect(windows.every(w => w.minutes > 0 && w.minutes <= 360)).toBe(true);
});

test('quarter-hour offsets and end boundary are preserved', () => {
  const windows = meetingWindows(['Asia/Kathmandu', 'Asia/Kolkata'], new Date('2026-09-15'));
  expect(windows[0].minutes).toBe(465);
  expect(windows[0].start.toISOString()).toContain('03:30:00');
  expect(windows[0].end.toISOString()).toContain('11:15:00');
});

test('EST remains a fixed abbreviation in summer and crosses months correctly', () => {
  expect(convertFixedTime('2026-09-15', '09:00', 'EST', 'IST').toTime).toBe('07:30 PM');
  expect(convertFixedTime('2026-01-31', '23:00', 'EST', 'IST').dayDiff).toBe(1);
  expect(convertFixedTime('2026-01-01', '00:00', 'IST', 'EST').dayDiff).toBe(-1);
});

test('future dated New York conversion uses the November offset', () => {
  const instant = resolveWallTime('2026-11-01', '3 PM', 'America/New_York');
  expect(instant.toISOString()).toBe('2026-11-01T20:00:00.000Z');
  expect(getUTCOffsetMinutes('Europe/London', instant)).toBe(0);
});

test('DST skipped and repeated local times require a new input', () => {
  expect(() => resolveWallTime('2026-03-08', '2:30 AM', 'America/New_York')).toThrow('does not exist');
  expect(() => resolveWallTime('2026-11-01', '1:30 AM', 'America/New_York')).toThrow('occurs twice');
  expect(() => resolveWallTime('2026-02-30', '12:00', 'UTC')).toThrow('valid date');
});

test('parser preserves city order, requested date and noon', () => {
  const parsed = localParseQuery('What time is 3 PM London in New York on November 1, 2026?');
  expect(parsed.intent).toBe('time_conversion');
  expect(parsed.entities).toMatchObject({from_city:'London', to_cities:['New York'], from_time:'3 PM', date:'2026-11-01'});
  expect(localParseQuery('Convert 12 PM New York to London on 2026-11-01').entities.from_time).toBe('12 PM');
  expect(localParseQuery('Convert 100 USD to EUR').entities).toEqual({amount:100,from_currency:'USD',to_currency:'EUR'});
});

test('no-overlap copy never describes minutes as hours', () => {
  const result = computeBusinessOverlap('America/New_York', 'Asia/Kolkata', new Date('2026-01-12'));
  expect(result.hasOverlap).toBe(false);
  expect(result.recommendation).not.toContain('630-hour');
});
