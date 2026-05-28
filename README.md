# ✨ KASSANDRE API

API astrologique premium pour la marque KASSANDRE.  
Calcule le profil Soleil / Lune / Ascendant et retourne un profil psychologique premium.

## Stack
- Node.js 20+ · Express · ES Modules
- Déployé sur Render

## Installation locale

```bash
npm install
cp .env.example .env
# Édite .env avec tes valeurs
npm run dev
```

## Endpoint

```
POST /api/kassandre-profile
Header: x-api-key: <KASSANDRE_API_KEY>

Body JSON:
{
  "firstName": "Léa",
  "birthDate": "1995-07-14",
  "birthTime": "14:30",
  "birthPlace": "Paris",
  "lat": 48.8566,
  "lng": 2.3522
}
```

## Réponse

```json
{
  "firstName": "Léa",
  "placements": {
    "sun": "Cancer",
    "moon": "Sagittaire",
    "rising": "Balance"
  },
  "profile": {
    "archetype": "Le romantique insaisissable",
    "tagline": "Tu veux être aimé sans jamais être retenu.",
    "description": "...",
    "aura": "...",
    "shadow": "...",
    "traits": [],
    "strengths": [],
    "weaknesses": [],
    "relationalEnergy": "...",
    "aesthetic": { "palette": [], "mood": "", "style": "" },
    "shopifyTags": []
  },
  "meta": {
    "version": "1.0.0",
    "generatedAt": "2026-05-28T12:00:00.000Z"
  }
}
```

## Déploiement Render

```bash
git push origin main
# Render détecte render.yaml et déploie automatiquement
```

## Santé de l'API

```
GET /health → { "status": "ok", "version": "1.0.0" }
```
