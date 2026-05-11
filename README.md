# SevenAuto

Monorepo cho dashboard (Next.js + NestJS). Mã nguồn ứng dụng nằm trong thư mục `dashboard/` (Turborepo + pnpm). Thư mục `tools/` là **placeholder** cho công cụ phụ trợ ngoài app (không dùng để chạy dự án).

## Yêu cầu

- Node.js 18+
- [pnpm](https://pnpm.io/) 9 (repo dùng `packageManager` trong `dashboard/package.json`)

## Bắt đầu nhanh

```sh
cd dashboard
pnpm install
cp apps/api/.env.example apps/api/.env   # chỉnh giá trị thật trước khi chạy API
pnpm dev
```

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
├── dashboard/          # Turborepo (apps + packages) — chạy pnpm tại đây
│   ├── apps/web        # Next.js
│   ├── apps/api        # NestJS + Prisma
│   └── packages/       # @repo/ui, @repo/libs, configs
├── docs/               # Hướng dẫn phát triển & triển khai
├── tools/              # Placeholder (script/tooling ngoài dashboard)
├── AGENTS.md
└── README.md
```
