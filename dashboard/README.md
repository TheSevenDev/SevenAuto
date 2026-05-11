# SevenAuto — `dashboard`

Turborepo dùng [pnpm workspaces](https://pnpm.io/workspaces). Workspace root là thư mục này (`pnpm-workspace.yaml`).

## Apps

| App | Mô tả | Dev |
|-----|--------|-----|
| **`apps/web`** | Next.js 16 (`web`) | `pnpm dev:web` → mặc định port **3000** |
| **`apps/api`** | NestJS 11 (`api`) | `pnpm dev:api` — cần `.env` (xem `apps/api/.env.example`) |

## Packages

- **`@repo/libs`** — types dùng chung (`packages/libs`).
- **`@repo/ui`** — component React (`packages/ui`).
- **`@repo/eslint-config`**, **`@repo/typescript-config`** — cấu hình ESLint/TS.

## Lệnh

```sh
pnpm install          # cài toàn workspace
pnpm dev              # turbo: chạy dev mọi app có task dev
pnpm build            # build production
pnpm lint             # lint
pnpm check-types      # kiểm tra kiểu
```

Tài liệu tổng quan repo (script từ root, triển khai): [../README.md](../README.md) và [../docs/getting-started.md](../docs/getting-started.md).

Tài liệu Turborepo chung: [turborepo.dev](https://turborepo.dev/docs).
