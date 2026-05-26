export const SIGNS_FR = [
  'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
  'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
];

export const SIGN_ALIASES = new Map([
  ['belier', 'Bélier'], ['bélier', 'Bélier'], ['aries', 'Bélier'],
  ['taureau', 'Taureau'], ['taurus', 'Taureau'],
  ['gemeaux', 'Gémeaux'], ['gémeaux', 'Gémeaux'], ['gemini', 'Gémeaux'],
  ['cancer', 'Cancer'],
  ['lion', 'Lion'], ['leo', 'Lion'], ['léon', 'Lion'],
  ['vierge', 'Vierge'], ['virgo', 'Vierge'],
  ['balance', 'Balance'], ['libra', 'Balance'],
  ['scorpion', 'Scorpion'], ['scorpio', 'Scorpion'],
  ['sagittaire', 'Sagittaire'], ['sagittarius', 'Sagittaire'],
  ['capricorne', 'Capricorne'], ['capricorn', 'Capricorne'],
  ['verseau', 'Verseau'], ['aquarius', 'Verseau'],
  ['poissons', 'Poissons'], ['pisces', 'Poissons']
]);

export function stripAccents(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeSign(value) {
  const key = stripAccents(value).toLowerCase().trim();
  return SIGN_ALIASES.get(key) || SIGN_ALIASES.get(String(value || '').toLowerCase().trim()) || null;
}

export function signFromLongitude(longitude) {
  const normalized = ((Number(longitude) % 360) + 360) % 360;
  return SIGNS_FR[Math.floor(normalized / 30)];
}
