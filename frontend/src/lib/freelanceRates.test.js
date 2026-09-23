import { annualRevenue } from './freelanceRates';
test('annual estimates respect the billing model and working weeks', () => {
  expect(annualRevenue(50, 'hourly', 25, 46)).toBe(57500);
  expect(annualRevenue(2000, 'monthly', 1, 46)).toBe(24000);
  expect(annualRevenue(3000, 'project', 8, 46)).toBe(24000);
  expect(annualRevenue(0, 'hourly', 25, 46)).toBe(0);
});
test('invalid amounts or schedules cannot produce misleading estimates', () => {
  for (const amount of ['', -1, Infinity, 'abc']) expect(annualRevenue(amount, 'hourly', 25, 46)).toBeNull();
  expect(annualRevenue(50, 'hourly', 169, 46)).toBeNull();
  expect(annualRevenue(50, 'hourly', 25, 53)).toBeNull();
});
