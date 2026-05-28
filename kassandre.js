import { Router } from 'express';
import { calcAstralPlacements } from '../services/astroCalculator.js';
import { lookupProfile } from '../services/profileLookup.js';
import { validateAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/kassandre-profile
 * Body: { firstName, birthDate, birthTime, birthPlace, lat, lng }
 */
router.post('/kassandre-profile', validateAuth, async (req, res, next) => {
  try {
    const { firstName, birthDate, birthTime, birthPlace, lat, lng } = req.body;

    // ── 1. Validation ──────────────────────────────────
    if (!firstName || !birthDate || !birthTime || lat === undefined || lng === undefined) {
      return res.status(400).json({
        error: 'Champs requis : firstName, birthDate, birthTime, lat, lng',
      });
    }

    // ── 2. Calcul astral ───────────────────────────────
    const placements = calcAstralPlacements({
      birthDate,
      birthTime,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    // ── 3. Lookup profil ───────────────────────────────
    const profile = lookupProfile(placements);

    if (!profile) {
      return res.status(404).json({
        error: 'Profil introuvable pour cette combinaison',
        placements,
      });
    }

    // ── 4. Réponse ─────────────────────────────────────
    return res.json({
      firstName,
      placements,
      profile,
      meta: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (err) {
    next(err);
  }
});

export default router;
