import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root for this app is `dashboard/` (avoid picking repo-root lockfile when a parent `pnpm-lock.yaml` exists).
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
};

export default nextConfig;
