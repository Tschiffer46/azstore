# AZStore — Project Plan

## What We're Building

Two connected systems:
1. **AZPIM** (azpim.agiletransition.se) — Internal PIM tool for the AZ Profil team
2. **AZStore** (azstore.agiletransition.se) — Public-facing white-label club store

The PIM is the single source of truth for product data. The store reads from it.

## Decisions Made

| Decision | Answer |
|----------|--------|
| Build vs Buy | Build lightweight custom (Option C) |
| SaaS PIM (Plytix) | Rejected — overkill |
| Open-source PIM (Akeneo, Pimcore) | Rejected — too heavy |
| Hosting | Hetzner server 89.167.90.112 |
| Product images | Stored on Hetzner for POC |
| Admin UI | Very simple — do not over-engineer |
| Login | 3 hardcoded users for now |
| Store name | azstore |

## Scale & Scope

| Item | Value |
|------|-------|
| Total SKUs | < 500 (different sizes, handful of partner brands) |
| Products per club | ~50 selected from master catalog |
| POC clubs | 2–3 |
| Stage 1 clubs | 5–10 |
| Current sales | 2 MSEK (no system yet) |

## Users & Roles

| Role | Who | Access |
|------|-----|--------|
| AZ Profil admin | Small team at company | Full catalog management, assign products to clubs, prices/discounts |
| Club admin | Sports club contact | Their store only + stats page (sales, kickback/earnings) |

## Tech Stack

- React 19 + TypeScript + Tailwind CSS 4
- Vite build tool
- Hetzner hosting (Docker + Nginx Proxy Manager + Cloudflare)
- GitHub Actions → rsync deployment
- JSON data files (no database for POC)
- 3 hardcoded users for auth

## Infrastructure

- Server: Hetzner 89.167.90.112, Ubuntu, Docker + Docker Compose
- Routing: Nginx Proxy Manager (GUI at port 81)
- DNS/CDN: Cloudflare
- SSH: deploy user, key-based auth
- Docker compose: /home/deploy/hosting/docker-compose.yml

## Setup Steps

| Step | What | Status |
|------|------|--------|
| 1 | Create azstore repo | ✅ |
| 2 | Scaffold project (this PR) | ✅ |
| 3 | Add GitHub Secrets | ⬜ |
| 4 | Create server directory | ⬜ |
| 5 | Add to docker-compose.yml | ⬜ |
| 6 | Add Nginx Proxy Manager host | ⬜ |
| 7 | Add Cloudflare DNS | ⬜ |
| 8 | Verify live site | ⬜ |
| 9 | Build PIM features | ⬜ |
