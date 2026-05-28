import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Chargement synchrone au démarrage — mis en cache en mémoire
const profilesData = JSON.parse(
  readFileSync(join(__dirname, '../data/profiles.json'), 'utf-8')
);

/**
 * Lookup d'un profil depuis les placements
 * @param {{ sun: string, moon: string, rising: string }} placements
 * @returns {object|null}
 */
export function lookupProfile({ sun, moon, rising }) {
  const key = buildKey(sun, moon, rising);
  const profile = profilesData[key] ?? null;

  if (!profile) {
    console.warn(`[LOOKUP] Profil manquant pour clé : ${key}`);
  }

  return profile;
}

/**
 * Génère la clé de lookup normalisée (sans accents, minuscules)
 * Ex: "cancer__sagittaire__balance"
 */
export function buildKey(sun, moon, rising) {
  return [sun, moon, rising]
    .map(s =>
      s.trim()
       .toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '')
       .replace(/\s+/g, '_')
    )
    .join('__');
}
