import 'dotenv/config';

import { createPrismaClient } from '../prisma/create-prisma-client';
import { seedEmailTemplate } from './email-templates';
import { seedUsers } from './user';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seeding');
}

const { client: prisma, pool } = createPrismaClient({ connectionString });

async function main() {
  console.log('==============================================');
  console.log('============= SEEDING DATABASE ==============');
  console.log('==============================================');

  await seedUsers(prisma);
  await seedEmailTemplate(prisma);

  console.log('==============================================');
  console.log('============= SEEDING COMPLETED =============');
  console.log('==============================================');
}
async function shutdown() {
  await prisma.$disconnect();
  await pool.end();
}

main()
  .then(shutdown)
  .catch(async (e) => {
    console.error(e);
    await shutdown();
    process.exit(1);
  });
