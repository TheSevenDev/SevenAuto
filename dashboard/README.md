# SevenAuto — `dashboard`

Turborepo dùng [pnpm workspaces](https://pnpm.io/workspaces). Workspace root là thư mục này (`pnpm-workspace.yaml`).

## Apps

| App            | Mô tả              | Dev                                                       |
| -------------- | ------------------ | --------------------------------------------------------- |
| **`apps/web`** | Next.js 16 (`web`) | `pnpm dev:web` → mặc định port **7272**                   |
| **`apps/api`** | NestJS 11 (`api`)  | `pnpm dev:api` — cần `.env` (xem `apps/api/.env.example`) |

## Packages

- **`@seven-auto/libs`** — types dùng chung (`packages/libs`).
- **`@seven-auto/ui`** — component React (`packages/ui`).
- **`@seven-auto/eslint-config`**, **`@seven-auto/typescript-config`** — cấu hình ESLint/TS.

## Lệnh

```sh
pnpm install          # cài toàn workspace
pnpm dev              # turbo: chạy dev mọi app có task dev
pnpm build            # build production
pnpm lint             # lint
pnpm check-types      # kiểm tra kiểu
pnpm format:check     # Prettier (chỉ kiểm tra, dùng trong Husky pre-commit)
```

Git hooks: chạy `pnpm install` ở **root repo** (thư mục cha), xem [../README.md](../README.md). Tài liệu triển khai: [../docs/getting-started.md](../docs/getting-started.md).

Tài liệu Turborepo chung: [turborepo.dev](https://turborepo.dev/docs).
