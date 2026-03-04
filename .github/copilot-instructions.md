# Copilot Instructions — AZStore

## Project Description

AZStore is a lightweight Product Information Management (PIM) system combined with a white-label club store for AZ Profil — a Swedish sports apparel company.

Two connected systems:
- **AZPIM** (azpim.agiletransition.se) — Internal PIM tool for the AZ Profil team
- **AZStore** (azstore.agiletransition.se) — Public-facing white-label club store

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (using the `@tailwindcss/vite` plugin — no separate config file)
- `react-router-dom` v7 for client-side routing
- No backend, no database — this is a static site

## Architecture

- Static site built with Vite, deployed to Hetzner server (89.167.90.112)
- GitHub Actions CI: push to `main` → `npm run build` → `rsync dist/` to server
- Server: Ubuntu, Docker + Docker Compose, Nginx Proxy Manager (port 81), Cloudflare DNS/CDN
- Each site runs as an nginx:alpine container behind Nginx Proxy Manager

## Data Layer

- All data lives in `src/data/` as JSON files (no database for POC)
- `products.json` — master product catalog
- `clubs.json` — club configuration and their active product selections
- `discounts.json` — volume discount tiers

## Authentication

- 3 hardcoded users: `admin/admin123`, `manager/manager123`, `viewer/viewer123`
- React Context + sessionStorage (no JWT, no backend)
- Protected routes redirect to `/login` if not authenticated

## Coding Standards

- **Strict TypeScript** — never use `any`. Always type everything explicitly.
- **Tailwind utility classes** for all styling — no custom CSS files except `src/index.css` for the Tailwind import.
- **Swedish for all user-facing text** (UI labels, headings, error messages, buttons).
- **English for all code and comments** (variable names, function names, comments).
- **Mobile-first responsive design** using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- No over-engineering — keep components small and straightforward.

## Deployment

1. Push to `main`
2. GitHub Actions runs `npm ci && npm run build`
3. `rsync -avz --delete dist/` to `~/hosting/sites/azstore/dist/` on Hetzner server
4. nginx:alpine container serves the static files

## What NOT to do

- Do NOT add a database
- Do NOT add server-side rendering (SSR)
- Do NOT add a backend API
- Do NOT over-engineer — this is a POC
- Do NOT use `any` types in TypeScript
