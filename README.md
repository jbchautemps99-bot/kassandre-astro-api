# KASSANDRE Astro API

API Node/Express pour ton site KASSANDRE.

Elle reçoit les infos de naissance, calcule ou simule les placements astrologiques, puis retourne le profil correspondant dans la base des **1 728 combinaisons Soleil / Lune / Ascendant**.

## Lancer en local

```bash
npm install
cp .env.example .env
npm run dev
```

Puis teste :

```bash
curl http://localhost:3000/health
```

## Endpoint principal

```http
POST /api/kassandre-profile
```

Payload :

```json
{
  "firstName": "Jean-Baptiste",
  "birthDate": "1999-07-12",
  "birthTime": "14:35",
  "birthPlace": "Paris, France"
}
```

Réponse :

```json
{
  "brand": "KASSANDRE",
  "placements": {
    "sun": "Cancer",
    "moon": "Sagittaire",
    "rising": "Balance",
    "provider": "mock"
  },
  "profile": {
    "title": "Soleil Cancer, Lune Sagittaire, Ascendant Balance"
  }
}
```

## Tester le lookup sans calcul de naissance

```http
POST /api/profile-by-signs
```

```json
{
  "sun": "Cancer",
  "moon": "Sagittaire",
  "rising": "Balance"
}
```

## Important : mode mock vs vrai calcul astral

Par défaut, `.env` utilise :

```env
ASTRO_PROVIDER=mock
```

Ce mode sert à tester l'API, le formulaire et la base. Il ne donne pas un vrai thème astral.

Pour la production, branche un vrai moteur dans :

```txt
src/services/astroCalculator.js
```

Le calcul réel doit gérer :

- géocodage ville → latitude/longitude
- timezone + heure d'été historique
- longitude Soleil
- longitude Lune
- Ascendant
- mapping longitude → signe

Swiss Ephemeris est une référence, mais vérifie bien sa licence pour un usage commercial/public.

## Sécurité

Tu peux protéger l'API avec une clé simple :

```env
API_KEY=ton-secret
```

Puis côté appel :

```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'ton-secret'
}
```

## Base profils

La base est ici :

```txt
src/data/profiles.json
```

Clé utilisée :

```txt
Soleil|Lune|Ascendant
```

## Déploiement recommandé

Simple : Render, Railway ou Fly.io.

Vercel est possible, mais il faudra adapter en serverless route Next.js.
