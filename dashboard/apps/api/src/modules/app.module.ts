import { ConfigModule } from '@nestjs/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { GlobalModule } from './global.module';
import { EnvModule } from 'src/modules/env/env.module';
import { UserMiddleware } from 'src/middleware/user.middleware';
import { AppController } from './app.controller';

@Module({
  imports: [
    EnvModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ScheduleModule.forRoot(),
    GlobalModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
