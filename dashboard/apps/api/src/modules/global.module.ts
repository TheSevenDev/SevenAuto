import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ApiHelper } from 'src/helpers/api.helper';
import { OptionHelper } from 'src/helpers/options.helper';
import { EnvService } from 'src/modules/env/env.service';
import { LoggerService } from 'src/modules/logger/logger.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 600000,
      maxRedirects: 5,
    }),
  ],
  providers: [ApiHelper, LoggerService, EnvService, OptionHelper],
  exports: [HttpModule, ApiHelper, LoggerService, EnvService, OptionHelper],
})
export class GlobalModule {}
