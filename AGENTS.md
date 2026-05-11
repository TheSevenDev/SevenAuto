# SevenAuto — context for agents

## Layout

- `dashboard/`: Turborepo (pnpm) — `apps/web` (Next.js 16), `apps/api` (NestJS 11), `packages/*` (`@repo/ui`, `@repo/libs`, configs).
- `tools/`: placeholder for auxiliary scripts/tooling outside the app monorepo (see `tools/README.md`); **do not** use it as the primary way to run `dashboard/`.
- `docs/`: human onboarding — `getting-started.md` (EN), `getting-started-vi.md` (VI); API env template: `dashboard/apps/api/.env.example`.

## Commands (from `dashboard/`)

- `pnpm dev` — all dev tasks.
- `pnpm build` — production build.
- `pnpm lint` / `pnpm check-types` — quality gates.

## API (`dashboard/apps/api`)

- Entry: `src/main.ts`, root module: `src/modules/app.module.ts`.
- Env: `EnvService` + `envalid` — **requires a valid `.env`** with all keys in `env.service.ts` to boot.
- `UserMiddleware` is a stub: attach real auth (e.g. JWT) when an auth module exists.
- `GlobalModule` currently exports `HttpModule`, `ApiHelper`, `LoggerService`, `EnvService` only; extend when Prisma/auth/notification are added.
- TypeScript: `tsconfig.json` sets `strictNullChecks` and `noImplicitAny` to `false` to avoid type errors from RxJS 7 typing (`.d.ts` re-exports that pull `src/`). Tighten gradually or move to a builder that does not typecheck `node_modules` the same way.

## Shared types

- Package `@repo/libs` — `export` map: `"."` → `src/index.ts` (import as `@repo/libs`).

## Conventions

- Keep new source files under ~250 lines; match existing style in each app.
- Prefer small, focused changes; do not add docs the user did not request.
