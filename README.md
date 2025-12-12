# MovieNight

Application Next.js (App Router) pour parcourir les films avec UI Base Web/Styletron, animations légères GSAP, tests Vitest/Playwright et déploiement Vercel.

## Live

- Prod : https://movienight-iota.vercel.app/

## Stack

- Framework : Next.js 14 (App Router), React 18
- UI : Base Web + Styletron, Google Fonts (Inter, Archivo Narrow)
- Animations : GSAP (ScrollTrigger) pour des entrées discrètes
- State léger : Zustand (store `movieStore`)
- Tests : Vitest + Testing Library (unit), Playwright (e2e)
- Qualité : ESLint (next/core-web-vitals), Prettier, TypeScript strict, Husky + lint-staged (pre-commit), pré-push lint/typecheck/test:unit

## Prérequis

- Node 18+
- pnpm (`corepack enable` recommandé)
- Clé TMDB : `TMDB_API_KEY`

## Installation

```bash
pnpm install
cp env.example .env.local
# Renseigner TMDB_API_KEY dans .env.local
```

## Développement

```bash
pnpm dev
```

## Tests et qualité

- Unitaires : `pnpm test:unit`
- E2E Playwright : `pnpm test:e2e` (nécessite un serveur en marche ou le `webServer` Playwright)
- Lint : `pnpm lint`
- Typecheck : `pnpm typecheck`
- Format : `pnpm format`

Les hooks Husky pré-push exécutent lint, typecheck et tests unitaires.

## Scripts

- `pnpm dev` : démarrage dev
- `pnpm build` / `pnpm start` : build et run prod
- `pnpm lint` : ESLint
- `pnpm typecheck` : TypeScript
- `pnpm test:unit` : tests Vitest
- `pnpm test:e2e` : tests Playwright
- `pnpm format` : Prettier

## Notes produit / UI

- Background dynamique : blur + overlay, limité à la zone header/hero; reste sur fond de base.
- Thèmes : clair/sombre via toggle, overlay ajusté par thème.
- Boutons de navigation carrousel harmonisés (fond sombre, icônes noires).
- Scroll-to-top mobile sur la page détail film.

## Structure principale

- `app/` : pages App Router (`/`, `/movie/[id]`, `/movie/[id]/credits`, `/search`)
- `components/` : UI (hero, carrousels, détails film, header, background)
- `lib/` : TMDB API client/helpers, GSAP helper, Styletron
- `hooks/` : `useMovies`, `useTmdb`
- `store/` : Zustand (`movieStore`)
- `tests/`, `e2e/` : suites unitaires et e2e
