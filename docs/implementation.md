# Implementation Notes

Auteur : I. (développement et intégration UI/SSR)

## Architecture

- Next.js 14 App Router (RSC + client components), React 18, SSR statique + revalidate 300s sur les pages movie.
- Providers : Styletron/Base Web engin serveur côté RSC, engin client côté browser (cf. `components/Providers.tsx`).
- UI : Base Web + Styletron theming (clair/sombre), fonts Inter + Archivo Narrow (vars CSS sur `<html>`), global tokens dans `app/globals.css`.
- State global : Zustand (`store/movieStore.ts`) pour le film courant (pilote le fond dynamique) et la recherche.
- Data flow : TMDB via `lib/tmdb/api.ts` (client axios `lib/tmdb/client.ts`, normalizers `lib/movie/*`). E2E_MOCK pour bypass réseau en tests/e2e.
- Animations : GSAP + ScrollTrigger encapsulés dans `lib/gsapClient.ts` (guards SSR/test, filtering de refs).
- Routing/pages : `/` (hero + carrousels), `/search`, `/movie/[id]`, `/movie/[id]/credits`; `loading.tsx` dédiés pour les routes movie/credits.

## Données / TMDB

- Accès via `lib/tmdb/api.ts` et helpers (normalizers).
- Clé requise : `TMDB_API_KEY` dans `.env.local`.

## Fond dynamique

- `BackgroundLayer` lit `currentMovie` depuis le store et applique un blur + overlay.
- Zone limitée au header/hero (~620px) avec masque dégradé. Fond de base en dessous.
- Overlay et brightness dépendent du thème (clair plus lumineux, sombre plus opaque).

## UI/UX

- Carrousels : boutons/chevrons unifiés (fond sombre, icônes noires).
- Scroll-to-top mobile ajouté sur la page détail film.
- Loading states : `loading.tsx` pour movie detail/credits + spinner BaseWeb.

## Tests et qualité

- Unitaires : Vitest + Testing Library.
- E2E : Playwright (`pnpm test:e2e`).
- ESLint + Prettier + TypeScript strict ; Husky pré-push lance lint/typecheck/tests unitaires.

## Bugs rencontrés

- Styletron SSR (Next App Router) : erreurs `keyframesRules` et `document` non défini. Résolu en isolant l’engine serveur/client et en limitant le rendu côté client pour Styletron.
- GSAP plugin “Missing plugin” en dev/test : ajout de guards SSR/test et filtrage des refs avant anim.
- Fond trop sombre en light : ajustement overlays/brightness par thème et limitation du blur à la zone hero.
- Background dynamique masqué : conflit de z-index/overlay, corrigé en ajustant `app-bg` et l’overlay par thème.

## Déploiement

- Prod Vercel : https://movienight-iota.vercel.app/

## Références utiles

- `components/BackgroundLayer.tsx` : fond dynamique
- `components/hero/HeroCarousel.tsx` : mise à jour du film courant pour le fond
- `app/movie/[id]/page.tsx` et `components/details/*` : détail/credits
- `lib/gsapClient.ts` : helpers GSAP avec protections SSR/test
