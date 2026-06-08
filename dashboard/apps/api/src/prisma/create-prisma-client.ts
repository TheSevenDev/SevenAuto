import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

export type PrismaLogLevel = 'query' | 'info' | 'warn' | 'error';

export function createPrismaClient(options: {
  connectionString: string;
  log?: PrismaLogLevel[];
}): { client: PrismaClient; pool: Pool } {
  const pool = new Pool({ connectionString: options.connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: options.log,
  });

  return { client, pool };
}
