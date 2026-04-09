# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Travel Blog (`artifacts/travel-blog`)
Minimalist travel blog "旅途 (Journey)" — React + Vite + Tailwind CSS.
- Masonry waterfall photo grid homepage with Framer Motion stagger animations
- Full-bleed image gallery detail pages with Markdown body rendering (react-markdown)
- Right sidebar with travel metadata (weather, rating, cost)
- Lightbox for photo viewing
- **PWA support**: `vite-plugin-pwa` configured with manifest, service worker, and icons
  - Icons: `public/icon.svg`, `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`
  - PWA active in production builds; service worker disabled in dev mode
  - Deploy the app to enable "Add to Home Screen" on mobile devices

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
