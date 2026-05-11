# SevenAuto

Monorepo cho dashboard (Next.js + NestJS). Mã nguồn ứng dụng nằm trong thư mục `dashboard/` (Turborepo + pnpm). Thư mục `tools/` là **placeholder** cho công cụ phụ trợ ngoài app (không dùng để chạy dự án).

## Yêu cầu

- Node.js 18+
- [pnpm](https://pnpm.io/) 9 (`packageManager` trong `package.json` ở root và trong `dashboard/package.json`)

## Bắt đầu nhanh

1. **Git hooks (Husky)** — chạy một lần ở **thư mục gốc repo** (cùng cấp với `.git`):

```sh
pnpm install
```

2. **Ứng dụng** — dependency và lệnh dev/build trong `dashboard/`:

```sh
cd dashboard
pnpm install
cp apps/api/.env.example apps/api/.env   # chỉnh giá trị thật trước khi chạy API
pnpm dev
```

Mỗi lần `git commit`, hook `pre-commit` chạy (trừ khi `CI` được set): `lint` → `check-types` → `format:check` → `build` trong `dashboard/`. Bỏ qua hook (không khuyến khích): `git commit --no-verify`.

- Web mặc định: [http://localhost:3000](http://localhost:3000)
- API: cổng và prefix lấy từ biến môi trường (`PORT`, `API_VERSION`); Swagger (nếu bật) xem log khi khởi động Nest.

## Lệnh chính (trong `dashboard/`)

| Lệnh | Mô tả |
|------|--------|
| `pnpm dev` | Chạy dev toàn monorepo (turbo) |
| `pnpm dev:web` / `pnpm dev:api` | Chỉ web hoặc chỉ API |
| `pnpm build` | Build production |
| `pnpm lint` | ESLint |
| `pnpm check-types` | Kiểm tra TypeScript |
| `pnpm format:check` | Kiểm tra Prettier (không ghi file) |

## Git hooks (Husky)

- Cài ở **root repo**: `pnpm install` (cài `husky`, gắn `core.hooksPath`).
- Mỗi commit chạy kiểm tra trong `dashboard/`: lint, types, Prettier check, build. Trên CI đặt `CI=true` thì hook thoát ngay (tránh chạy lại trong pipeline nếu có commit).

## Tài liệu thêm

| File | Nội dung |
|------|----------|
| [docs/getting-started.md](docs/getting-started.md) | Cấu trúc repo, env API, gợi ý triển khai |
| [docs/getting-started-vi.md](docs/getting-started-vi.md) | Bản tóm tắt tiếng Việt |
| [AGENTS.md](AGENTS.md) | Ghi chú cho agent / contributor |
| [dashboard/README.md](dashboard/README.md) | Chi tiết app `web` và `api` trong monorepo |
| [tools/README.md](tools/README.md) | Placeholder công cụ phụ trợ (không chạy app) |

## Cấu trúc thư mục

```text
SevenAuto/
├── .husky/             # Git hooks (Husky)
├── package.json        # Husky + prepare (cùng cấp .git)
├── dashboard/          # Turborepo (apps + packages) — chạy pnpm tại đây
│   ├── apps/web        # Next.js
│   ├── apps/api        # NestJS + Prisma
│   └── packages/       # @seven-auto/ui, @seven-auto/libs, configs
├── docs/               # Hướng dẫn phát triển & triển khai
├── tools/              # Placeholder (script/tooling ngoài dashboard)
├── AGENTS.md
└── README.md
```
