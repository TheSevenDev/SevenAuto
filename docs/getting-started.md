# Getting started (SevenAuto)

## Repository layout

| Path | Role |
|------|------|
| `dashboard/apps/web` | Next.js 16 frontend |
| `dashboard/apps/api` | NestJS 11 API, Prisma, strict env validation |
| `dashboard/packages/libs` | Shared types (`@repo/libs`) |
| `dashboard/packages/ui` | Shared UI (`@repo/ui`) |
| `dashboard/packages/eslint-config`, `typescript-config` | Shared tooling configs |

All pnpm commands are run from **`dashboard/`**.

## API environment

The API does not boot until every variable in `EnvService.validate()` is present and valid. Copy the template and edit values for your machine or deployment:

```sh
cd dashboard
cp apps/api/.env.example apps/api/.env
```

See `apps/api/.env.example` for the full list of keys and short comments. Source of truth for types and validation: `apps/api/src/modules/env/env.interface.ts` and `apps/api/src/modules/env/env.service.ts`.

## Local development

1. Install dependencies: `pnpm install` (from `dashboard/`).
2. Ensure MySQL (or compatible DB for `DATABASE_URL`), Redis, and any S3/email services you enable match `.env`.
3. Sync the database schema when `prisma/schema.prisma` changes (from `apps/api/`), e.g. `pnpm exec prisma db push` for local prototyping, or `pnpm exec prisma migrate dev` once your team adds a migrations workflow.
4. `pnpm dev` runs Turbo `dev` for all packages that define it (typically `web` + `api`).

## Deployment notes

- **Build**: from `dashboard/`, run `pnpm build`. Outputs include `apps/web/.next` and `apps/api/dist`.
- **API runtime**: use `pnpm start:prod` in `apps/api` (or `node dist/main` after build) with production `.env` injected by your host (Kubernetes secrets, systemd `EnvironmentFile`, etc.). Never commit real `.env`.
- **Web**: standard Next.js hosting (Node server, Docker, or platform such as Vercel) with `pnpm start` after `pnpm build` in `apps/web`.
- Align public URLs: `API_URL`, `BASE_URL`, and `ASSETS_URL` should match what browsers and the API use in each environment.

## Quality gates

From `dashboard/`:

- `pnpm lint`
- `pnpm check-types`

CI should run the same commands on every change touching `dashboard/`.
