import { TextEncoder, TextDecoder } from 'util';
import { createSharedTeam, readSharedTeam, sharedTeamPath } from './sharedTeam';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const sample = { name: 'Design São Paulo', members: [{ name: 'Zoë', city: 'London', timezone_id: 'Europe/London', utc_offset: '+01:00' }] };

test('a complete link restores a Unicode workspace without storage or private fields', () => {
  const team = createSharedTeam({ ...sample, email: 'private@example.invalid', is_paid: true });
  const restored = readSharedTeam(team.shareHash);
  expect(restored.name).toBe(sample.name);
  expect(restored.members).toEqual(sample.members);
  expect(restored.email).toBeUndefined();
  expect(restored.is_paid).toBe(false);
  expect(sharedTeamPath(team)).toContain('#team=');
});
test('rejects invalid or incomplete links and unsupported team inputs', () => {
  expect(() => readSharedTeam('')).toThrow();
  expect(() => readSharedTeam('#team=invalid')).toThrow();
  expect(() => createSharedTeam({ ...sample, members: Array(7).fill(sample.members[0]) })).toThrow();
  expect(() => createSharedTeam({ ...sample, members: [{ ...sample.members[0], timezone_id: 'Invalid/Zone' }] })).toThrow();
});
