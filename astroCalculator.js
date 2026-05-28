import { getSunSign, getMoonSign, getRisingSign } from '../utils/signs.js';

/**
 * Calcule les placements soleil / lune / ascendant
 * @param {object} params
 * @param {string} params.birthDate  - "1995-07-14"
 * @param {string} params.birthTime  - "14:30"
 * @param {number} params.lat        - latitude (ex: 48.8566)
 * @param {number} params.lng        - longitude (ex: 2.3522)
 * @returns {{ sun: string, moon: string, rising: string }}
 */
export function calcAstralPlacements({ birthDate, birthTime, lat, lng }) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute]     = birthTime.split(':').map(Number);

  // Date UTC — le client doit envoyer l'heure locale convertie en UTC
  const birthDt = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const sun    = getSunSign(birthDt);
  const moon   = getMoonSign(birthDt);
  const rising = getRisingSign(birthDt, lat, lng);

  return { sun, moon, rising };
}
