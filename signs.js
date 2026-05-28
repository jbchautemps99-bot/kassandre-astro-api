/**
 * Calculs astrologiques — production-ready
 * Basé sur les algorithmes de Jean Meeus "Astronomical Algorithms"
 */

export const ZODIAC_SIGNS = [
  'Bélier', 'Taureau', 'Gémeaux', 'Cancer',
  'Lion', 'Vierge', 'Balance', 'Scorpion',
  'Sagittaire', 'Capricorne', 'Verseau', 'Poissons',
];

function degreesToSign(deg) {
  const normalized = ((deg % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[index];
}

/** Jour Julien depuis une Date JS UTC */
function toJulianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Longitude solaire approchée (précision ~1°) */
export function getSunSign(date) {
  const jd = toJulianDay(date);
  const n  = jd - 2451545.0;
  const L  = (280.46 + 0.9856474 * n) % 360;
  const g  = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  return degreesToSign(lambda);
}

/** Longitude lunaire approchée (précision ~2°) */
export function getMoonSign(date) {
  const jd = toJulianDay(date);
  const T  = (jd - 2451545.0) / 36525;
  const L0 = 218.3164477 + 481267.88123421 * T;
  const M  = (134.9633964 + 477198.8676313  * T) * Math.PI / 180;
  const Ms = (357.5291092 + 35999.0502909   * T) * Math.PI / 180;
  const D  = (297.8501921 + 445267.1114034  * T) * Math.PI / 180;
  const F  = (93.2720950  + 483202.0175233  * T) * Math.PI / 180;

  const lambda =
    L0
    + 6.288774 * Math.sin(M)
    + 1.274027 * Math.sin(2 * D - M)
    + 0.658314 * Math.sin(2 * D)
    + 0.213618 * Math.sin(2 * M)
    - 0.185116 * Math.sin(Ms)
    - 0.114332 * Math.sin(2 * F);

  return degreesToSign(lambda);
}

/** Ascendant basé sur le temps sidéral local */
export function getRisingSign(date, lat, lng) {
  const jd = toJulianDay(date);
  const T  = (jd - 2451545.0) / 36525;

  // Temps sidéral de Greenwich (degrés)
  let GAST = 280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T;
  GAST = ((GAST % 360) + 360) % 360;

  // Temps sidéral local
  const LST = (GAST + lng + 360) % 360;

  // Obliquité de l'écliptique
  const eps  = (23.439291111 - 0.013004167 * T) * Math.PI / 180;
  const latR = lat * Math.PI / 180;
  const LSTR = LST * Math.PI / 180;

  // Angle ascendant
  const ascDeg =
    Math.atan2(
      Math.cos(LSTR),
      -(Math.sin(LSTR) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps))
    ) * 180 / Math.PI;

  return degreesToSign(ascDeg);
}
