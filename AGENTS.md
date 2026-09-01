# AGENTS.md — Academia–Industry Skill Intelligence Platform

## Project Overview

An AI-powered Skills-to-Opportunity Intelligence Platform connecting students, industry, faculty, and institutions.

Core value proposition: **Skills → Intelligence → Growth → Opportunity → Outcome**

## Architecture

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: NestJS + TypeScript + REST + Swagger
- **Database**: MongoDB + Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **AI**: Gemini via abstracted AIProvider (demo fallback built-in)
- **Monorepo**: npm workspaces

## Repository Structure

```
apps/web/      — Next.js frontend (all roles)
apps/api/      — NestJS REST API
packages/database/   — Prisma schema + generated client
packages/types/      — Shared TypeScript interfaces
packages/validation/ — Shared Zod schemas
```

## Engineering Standards

See `.agents/rules/` for detailed standards.

### Critical Rules (memorize these)

1. **No `any` types** — Use explicit types, discriminated unions, and shared schemas
2. **Backend is source of truth** — Never duplicate business logic in the frontend
3. **Every endpoint needs auth + RBAC guards** — Check role on backend, not just frontend
4. **No secrets in code or git** — Use `.env` files, validate at startup
5. **AI must have demo fallback** — Never break UI when AI keys are absent
6. **Every feature needs error/loading/empty states** — No blank screens
7. **Responsive first** — Test on mobile, don't just shrink desktop

## Demo Accounts

See `scripts/seed/` for demo credentials. All marked as DEMO ONLY.

## Commands

```bash
# Start infrastructure
docker compose up -d

# Database
cd packages/database && npx prisma db push && npx prisma db seed

# Development
npm run dev              # starts both API + Web

# Testing
npm run test             # unit + integration
npm run test:e2e         # end-to-end

# Build
npm run build            # production build
```

## Workspace Rules Location

`.agents/rules/` — loaded automatically by Antigravity
