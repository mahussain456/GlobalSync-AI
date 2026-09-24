const PREFIX = '#team=';

function validateTeam(value) {
  if (!value || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 100 ||
      !Array.isArray(value.members) || value.members.length < 1 || value.members.length > 6) {
    throw new Error('Use a short workspace name and one to six members.');
  }
  const members = value.members.map(member => {
    for (const key of ['name', 'city', 'timezone_id', 'utc_offset']) {
      if (typeof member?.[key] !== 'string' || member[key].length > 100) throw new Error('Invalid member details.');
    }
    if (!member.name.trim()) throw new Error('Each member needs a label.');
    try { new Intl.DateTimeFormat('en', { timeZone: member.timezone_id }).format(); }
    catch { throw new Error('Choose a valid city time zone.'); }
    return { name: member.name, city: member.city, timezone_id: member.timezone_id, utc_offset: member.utc_offset };
  });
  return { name: value.name.trim(), members, is_paid: false };
}

export function createSharedTeam(value) {
  const team = validateTeam(value);
  const bytes = new TextEncoder().encode(JSON.stringify(team));
  const encoded = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { ...team, slug: `shared-${id}`, shareHash: `${PREFIX}${encoded}` };
}

export function readSharedTeam(hash) {
  if (!hash.startsWith(PREFIX) || hash.length > 10000) throw new Error('This workspace link is incomplete or invalid. Ask for the complete link.');
  try {
    const raw = atob(hash.slice(PREFIX.length).replace(/-/g, '+').replace(/_/g, '/'));
    return validateTeam(JSON.parse(new TextDecoder().decode(Uint8Array.from(raw, c => c.charCodeAt(0)))));
  } catch { throw new Error('This workspace link is incomplete or invalid. Ask for the complete link.'); }
}

export function sharedTeamPath(team) {
  return `/team/${encodeURIComponent(team.slug)}${team.shareHash || ''}`;
}
