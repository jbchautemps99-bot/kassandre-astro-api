import { SIGNS_FR, signFromLongitude } from '../utils/signs.js';

function seededIndex(input, salt = 0) {
  const seed = [...JSON.stringify(input)].reduce((acc, char) => acc + char.charCodeAt(0), salt);
  return seed % 12;
}

function mockPlacements(input) {
  // Mode démo : il permet de tester l'API et le lookup, mais ce n'est PAS un vrai thème astral.
  return {
    sun: SIGNS_FR[seededIndex(input, 0)],
    moon: SIGNS_FR[seededIndex(input, 4)],
    rising: SIGNS_FR[seededIndex(input, 8)],
    provider: 'mock',
    accuracy: 'demo-only'
  };
}

async function swissPlacements(input) {
  // À brancher pour la production.
  // Recommandation : créer un service séparé qui retourne les longitudes Soleil/Lune + Ascendant.
  // Puis utiliser signFromLongitude(longitude) pour mapper vers les signes français.
  //
  // Étapes production :
  // 1. Geocoding birthPlace -> latitude/longitude si absentes.
  // 2. Timezone + heure d'été historique -> convertir l'heure locale en UTC.
  // 3. Calculer longitude Soleil + Lune.
  // 4. Calculer Ascendant selon le système de maisons choisi.
  // 5. Retourner { sun, moon, rising }.
  throw new Error('ASTRO_PROVIDER=swiss est prévu mais non branché. Utilise ASTRO_PROVIDER=mock pour tester immédiatement.');
}

export async function getPlacements(input) {
  const provider = process.env.ASTRO_PROVIDER || 'mock';

  if (provider === 'mock') return mockPlacements(input);
  if (provider === 'swiss') return swissPlacements(input);

  throw new Error(`ASTRO_PROVIDER inconnu: ${provider}`);
}

export { signFromLongitude };
