import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool, PoolClient } from 'pg';
import { EnvService } from 'src/modules/env/env.service';

import { PrismaLogLevel } from './create-prisma-client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(env: EnvService) {
    const log: PrismaLogLevel[] = env.PRISMA_LOG
      ? ['query', 'info', 'warn', 'error']
      : [];

    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    patchPoolClientForSerialization(pool);

    const adapter = new PrismaPg(pool);
    super({ adapter, log });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      if (process.env.NODE_ENV === 'test') {
        console.warn(
          'Prisma connection failed in test environment, continuing without database',
        );
        return;
      }
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}

/**
 * Patch PoolClient để serialize các query calls, tránh lỗi "client is already executing a query"
 */
function patchPoolClientForSerialization(pool: Pool) {
  pool.on('connect', (client: PoolClient) => {
    const originalQuery = client.query.bind(client);
    let queryQueue: Promise<unknown> = Promise.resolve();

    client.query = (...args: Parameters<PoolClient['query']>) => {
      const result = queryQueue.then(() => originalQuery(...args));
      queryQueue = result.catch(() => {});
      return result;
    };
  });
}
