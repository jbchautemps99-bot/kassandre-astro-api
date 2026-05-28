import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Charge .env manuellement — plus fiable que dotenv sur Render
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envPath = join(__dirname, '../.env');
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && !process.env[key]) {
      process.env[key] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
} catch {
  // Pas de .env en prod — c'est normal, les vars viennent de Render
}

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import kassandreRouter from './routes/kassandre.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS ─────────────────────────────────────────────
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
  ? rawOrigins.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  methods: ['POST', 'GET', 'OPTIONS'],
}));

// ── BODY PARSER ──────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── RATE LIMIT ───────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── ROUTES ───────────────────────────────────────────
app.use('/api', kassandreRouter);

// ── HEALTH CHECK ─────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', env: process.env.NODE_ENV || 'development' });
});

// ── 404 ──────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route introuvable' }));

// ── ERROR HANDLER ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[KASSANDRE ERROR]', err.message, err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ KASSANDRE API live → port ${PORT}`);
});
