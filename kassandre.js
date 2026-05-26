import express from 'express';
import { z } from 'zod';
import { getPlacements } from '../services/astroCalculator.js';
import { findProfile, listProfiles } from '../services/profileLookup.js';

const router = express.Router();

const birthSchema = z.object({
  firstName: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/),
  birthPlace: z.string().min(2),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  timezone: z.string().optional()
});

const manualSchema = z.object({
  sun: z.string().min(2),
  moon: z.string().min(2),
  rising: z.string().min(2)
});

router.post('/kassandre-profile', async (req, res) => {
  const parsed = birthSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid payload',
      expected: { birthDate: 'YYYY-MM-DD', birthTime: 'HH:mm', birthPlace: 'Paris, France' },
      details: parsed.error.flatten()
    });
  }

  try {
    const placements = await getPlacements(parsed.data);
    const profile = findProfile(placements);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found for calculated placements', placements });
    }

    return res.json({
      brand: 'KASSANDRE',
      input: parsed.data,
      placements,
      profile
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/profile-by-signs', (req, res) => {
  const parsed = manualSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid signs payload', details: parsed.error.flatten() });
  }

  const profile = findProfile(parsed.data);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  return res.json({ brand: 'KASSANDRE', placements: parsed.data, profile });
});

router.get('/profiles', (req, res) => {
  const limit = Math.min(Number(req.query.limit || 24), 100);
  const offset = Math.max(Number(req.query.offset || 0), 0);
  return res.json(listProfiles({ limit, offset }));
});

export default router;
