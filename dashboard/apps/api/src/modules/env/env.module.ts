import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

let envFileName = `.env`;
const envFilePath = path.resolve(envFileName);

if (process.env.NODE_ENV === 'production') envFileName = '.env';
if (process.env.NODE_ENV === 'test') envFileName = '.env.test';

dotenv.config({ path: envFilePath });

if (process.env.NODE_ENV !== 'test') {
  console.log(
    '\n🌈  Load .env File of API:',
    envFilePath,
    process.env.NODE_ENV,
    '\n',
  );
}

@Global()
@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
