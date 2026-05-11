# SevenAuto — hướng dẫn nhanh (tiếng Việt)

## Repo gồm gì?

- **`dashboard/`**: toàn bộ code ứng dụng (Turborepo). Trong đó:
  - **`apps/web`**: giao diện Next.js.
  - **`apps/api`**: backend NestJS; **bắt buộc** có file `.env` đủ biến (xem `.env.example`).
- **`tools/`**: placeholder cho công cụ phụ trợ sau này — **không** dùng để chạy app; mọi lệnh dev/build chạy trong `dashboard/`.
- **`docs/`**: tài liệu chi tiết hơn (file tiếng Anh `getting-started.md` mô tả triển khai và env).
- **Root** (`package.json`, `.husky/`): Husky — `pnpm install` tại root để gắn hook `pre-commit` (lint, type, format check, build trong `dashboard/`).

## Làm việc hằng ngày

1. **Root repo:** `pnpm install` (bật Husky / Git hooks).
2. `cd dashboard && pnpm install`
3. Tạo env API: `cp apps/api/.env.example apps/api/.env` rồi sửa giá trị thật.
4. Chạy dev: `pnpm dev`
5. Chỉ web hoặc API: `pnpm dev:web` / `pnpm dev:api`

## Lưu ý triển khai (production)

- Build tại `dashboard/`: `pnpm build`.
- API: cấp `.env` (hoặc biến môi trường tương đương) trên server; không đẩy file `.env` lên git.
- Đồng bộ URL (`API_URL`, `BASE_URL`, `ASSETS_URL`) với domain thật của từng môi trường.

Chi tiết kỹ thuật và bảng lệnh đầy đủ: [README.md](../README.md) và [getting-started.md](getting-started.md) (trong đó có gợi ý Prisma / DB).
