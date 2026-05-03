# Crevette — Quianne's Cyberfolio

Portfolio personnel de **Quianne**, étudiante en cybersécurité chez
[Guardia Cybersecurity School](https://www.guardia.school/). Single-page React
app construite avec Vite, TypeScript, Tailwind v4, React Router et
Framer Motion.

## Stack

| Couche       | Outil                                          |
| ------------ | ---------------------------------------------- |
| Build        | [Vite 6](https://vite.dev/)                    |
| Framework    | [React 18](https://react.dev/) + TypeScript    |
| Styles       | [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`) |
| Routing      | [React Router v6](https://reactrouter.com/)    |
| Animations   | [Framer Motion](https://www.framer.com/motion/) |
| Icônes       | [Lucide](https://lucide.dev/)                  |
| Package mgr  | [pnpm 10](https://pnpm.io/)                    |

## Démarrer en local

```bash
# Activer pnpm via corepack (une fois)
corepack enable

cd Frontend
pnpm install
pnpm dev          # http://localhost:5173
```

## Scripts disponibles

```bash
pnpm dev          # serveur de dev avec HMR
pnpm typecheck    # vérification TypeScript stricte
pnpm build        # build de production -> Frontend/dist
pnpm preview      # serve le build localement
```

## Structure

```
Crevette/
├── .github/
│   ├── dependabot.yml         # mises à jour automatiques (npm + actions)
│   └── workflows/
│       ├── ci.yml             # typecheck + build à chaque push/PR
│       └── codeql.yml         # analyse statique de sécurité
├── Frontend/
│   ├── public/                # assets statiques (favicon, robots, sitemap, og)
│   ├── src/
│   │   ├── components/        # Layout, AmbientBackground, TiltCard…
│   │   ├── pages/             # Home, About, Projects, Game, Contact, NotFound
│   │   ├── lib/               # utils (cn helper)
│   │   ├── App.tsx            # routes (lazy-loaded)
│   │   └── main.tsx           # entrypoint React
│   ├── index.html             # SEO complet (OG, Twitter, JSON-LD, CSP)
│   ├── vite.config.ts         # build avec manual chunks vendor splitting
│   └── tsconfig.json          # TS strict
├── README.md
└── SECURITY.md
```

## Déploiement

Le build statique sort dans `Frontend/dist/` et peut être servi sur n'importe
quel host statique (Cloudflare Pages, Netlify, Vercel, GitHub Pages…).

- `Frontend/public/_redirects` gère le fallback SPA pour Netlify/CF Pages.
- `Frontend/public/404.html` gère le fallback SPA pour GitHub Pages
  (recovery via `sessionStorage`).

## Sécurité & qualité

- **CodeQL** : analyse statique JS/TS + Actions, hebdomadaire et sur PR.
- **Dependabot** : MAJ groupées des deps npm + GitHub Actions, chaque lundi.
- **CSP stricte** dans `index.html`, scripts en self-only.
- **`rel="noopener noreferrer"`** sur tous les liens externes.
- **Honeypot** sur le formulaire de contact.
- Voir [`SECURITY.md`](./SECURITY.md) pour signaler une faille.

## SEO

- Meta tags complets (description, robots, theme-color, canonical).
- Open Graph + Twitter Cards avec image dédiée (`/og-image.svg`).
- Données structurées JSON-LD (`Person` + `WebSite`).
- `sitemap.xml` et `robots.txt` servis depuis `/public`.
- `manifest.webmanifest` pour l'installation PWA.

## Performance

- Routes **lazy-loaded** (`React.lazy` + `Suspense`).
- **Manual chunks** Rollup (react / router / motion / icons / vendor).
- Cible `es2022` (bundle plus léger sur navigateurs modernes).
- Polices Google chargées en `print` puis `swap` pour éviter le blocage.
- `prefers-reduced-motion` respecté côté composants animés.

## Licence

Code propriétaire. Tous droits réservés. Demande d'utilisation : voir contact.
