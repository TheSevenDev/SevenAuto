import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(__dirname, '../..');

const withNextIntl = createNextIntlPlugin('./modules/locales/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root for this app is `dashboard/` (avoid picking repo-root lockfile when a parent `pnpm-lock.yaml` exists).
  transpilePackages: ['@seven-auto/libs'],
  turbopack: {
    root: monorepoRoot,
  },
};

export default withNextIntl(nextConfig);
