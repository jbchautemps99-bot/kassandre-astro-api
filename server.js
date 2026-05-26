import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import kassandreRouter from './routes/kassandre.js';
import { requireApiKey } from './middleware/auth.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(requireApiKey);

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'kassandre-astro-api', provider: process.env.ASTRO_PROVIDER || 'mock' });
});

app.use('/api', kassandreRouter);

// Alias temporaire pour compatibilité avec l'ancien kit.
app.use('/api/astro-profile', (req, res, next) => {
  req.url = '/kassandre-profile';
  kassandreRouter(req, res, next);
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(port, () => {
  console.log(`KASSANDRE Astro API running on http://localhost:${port}`);
});
