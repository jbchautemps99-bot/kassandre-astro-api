import profiles from '../data/profiles.json' assert { type: 'json' };
import { normalizeSign } from '../utils/signs.js';

const keyOf = (sun, moon, rising) => `${sun}|${moon}|${rising}`;
const index = new Map(profiles.map((profile) => [profile.key, profile]));

export function findProfile({ sun, moon, rising }) {
  const normalized = {
    sun: normalizeSign(sun),
    moon: normalizeSign(moon),
    rising: normalizeSign(rising)
  };

  if (!normalized.sun || !normalized.moon || !normalized.rising) return null;

  return index.get(keyOf(normalized.sun, normalized.moon, normalized.rising)) || null;
}

export function listProfiles({ limit = 24, offset = 0 } = {}) {
  return {
    total: profiles.length,
    limit,
    offset,
    items: profiles.slice(offset, offset + limit)
  };
}
