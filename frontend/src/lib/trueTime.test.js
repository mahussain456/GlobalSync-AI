import { offsetFromServerDate } from './trueTime';

test('a device clock that is 5 minutes slow is corrected', () => {
  const server = Date.parse('Thu, 15 Oct 2026 18:20:00 GMT');
  const local = server - 5 * 60000;
  const offset = offsetFromServerDate('Thu, 15 Oct 2026 18:20:00 GMT', local - 100, local + 100);
  expect(Math.round(offset / 1000)).toBe(301);
});

test('small differences inside network jitter are ignored', () => {
  const server = Date.parse('Thu, 15 Oct 2026 18:20:00 GMT');
  expect(offsetFromServerDate('Thu, 15 Oct 2026 18:20:00 GMT', server, server + 400)).toBe(0);
  expect(offsetFromServerDate('not a date', 0, 1)).toBe(0);
});
