import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiHelper } from 'src/helpers/api.helper';
import { LoggerService } from 'src/modules/logger/logger.service';
import { EnvService } from 'src/modules/env/env.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 600000,
      maxRedirects: 5,
    }),
  ],
  providers: [ApiHelper, LoggerService, EnvService],
  exports: [HttpModule, ApiHelper, LoggerService, EnvService],
})
export class GlobalModule {}
