# Code with Sleek Portfolio

A production portfolio platform for Emmanuel Ihenacho and Code with Sleek. The application combines a motion-led public website, structured case studies, performance evidence, and a protected single-administrator content dashboard.

## Product surface

- Public landing page with selected work, process, capabilities, testimonials, profile, and contact sections.
- Filterable project archive and reusable structured case-study pages.
- One-click résumé delivery with an administrator-configurable URL fallback.
- Protected administration for projects, media, technologies, testimonials, audits, enquiries, and site settings.
- Cloudinary-backed media, Neon PostgreSQL persistence, Auth.js authentication, and PageSpeed evidence.

## Stack

- Next.js 16 App Router, React 19, and TypeScript.
- Prisma with PostgreSQL.
- Auth.js for administrator authentication.
- Cloudinary for managed portfolio media.
- GSAP and ScrollTrigger for isolated motion experiences.
- Vitest, Testing Library, Playwright, Axe, and Lighthouse CI.

## Architecture

Public routes remain server-first. Client Components are limited to interaction and motion islands. Feature code is grouped under `src/features`, shared interface elements live under `src/components`, and external services are isolated under `src/server`.

Project case studies are rendered from validated data and reusable section types rather than project-specific page components. Mutations authenticate, validate input, deliberately shape their results, and revalidate affected public routes.

See [architecture decisions](docs/architecture-decisions.md) and the [production runbook](docs/production-runbook.md) for the operational constraints.

## Local setup

Requirements:

- Node.js compatible with Next.js 16.
- pnpm 11.
- PostgreSQL/Neon and Cloudinary credentials for data-backed features.

```bash
pnpm install
copy .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Never commit populated environment files.

## Quality commands

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use `pnpm test:e2e` for local end-to-end coverage and `pnpm test:e2e:production` after a Vercel deployment. Authenticated E2E checks require the dedicated `E2E_ADMIN_*` credentials described in `.env.example`.

## Deployment

The production application runs on Vercel. Before release, verify `/api/health`, the landing page, project archive, a published case study, résumé download, and administrator sign-in on desktop and mobile. Follow the production runbook for rollback and database or media recovery.
