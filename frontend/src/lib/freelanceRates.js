export function annualRevenue(amount, type, units, weeks) {
  const values = [amount, units, weeks].map(Number);
  if ([amount, units, weeks].some(value => String(value).trim() === '') || values.some(value => !Number.isFinite(value) || value < 0)) return null;
  const [rate, count, workingWeeks] = values;
  if (workingWeeks > 52 || (type === 'hourly' && count > 168)) return null;
  const total = type === 'hourly' ? rate * count * workingWeeks : type === 'monthly' ? rate * 12 : type === 'project' ? rate * count : NaN;
  return Number.isFinite(total) ? total : null;
}
