import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeSign } from '../utils/signs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profilesPath = path.join(__dirname, '../data/profiles.json');
const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

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
