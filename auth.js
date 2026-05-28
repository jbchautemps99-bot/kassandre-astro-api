const API_KEY = process.env.KASSANDRE_API_KEY;

/**
 * Middleware d'authentification par API Key.
 * Désactivé si KASSANDRE_API_KEY n'est pas défini (dev local).
 * Accepte la clé via header x-api-key ou Authorization: Bearer <key>
 */
export function validateAuth(req, res, next) {
  // Dev local sans clé configurée : on passe
  if (!API_KEY) return next();

  const provided =
    req.headers['x-api-key'] ??
    req.headers['authorization']?.replace('Bearer ', '').trim();

  if (!provided || provided !== API_KEY) {
    return res.status(401).json({ error: 'Clé API invalide ou manquante' });
  }

  next();
}
