import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//Middleware
import { ScheduleModule } from '@nestjs/schedule';
// import { EnvService } from 'src/module/env/env.service';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { CustomCacheInterceptor } from 'src/interceptor/cache.interceptor';
// import { CacheModule } from '@nestjs/cache-manager';
import { UserMiddleware } from 'src/middleware/user.middleware';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { EmailModule } from 'src/modules/email/email.module';
import { EnvModule } from 'src/modules/env/env.module';
import { GeneralModule } from 'src/modules/general/general.module';
import { MediaModule } from 'src/modules/media/media.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { PostModule } from 'src/modules/post/post.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

//Controller
import { AppController } from './app.controller';
// import redisStore from 'cache-manager-redis-store';
//Module
import { GlobalModule } from './global.module';
import { PaymentModule } from './payment/payment.module';
import { QueuesModule } from './queues/queues.module';
import { TransactionModule } from './transaction/transaction.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    // CacheModule.register({
    //   isGlobal: true,
    //   inject: [EnvService],
    //   useFactory: async (env: EnvService) => ({
    //     ttl: 300,
    //     max: 100,
    //     store: redisStore as any,
    //     host: env.REDIS_HOST,
    //     port: env.REDIS_PORT,
    //     db: 1,
    //     password: env.REDIS_PASSWORD,
    //   }),
    // }),
    EnvModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ScheduleModule.forRoot(),
    GlobalModule,
    PrismaModule,
    GeneralModule,
    AuthModule,
    RoleModule,
    UserModule,
    MediaModule,
    EmailModule,
    PostModule,
    CategoryModule,
    NotificationModule,
    WebsocketModule,
    QueuesModule,
    TransactionModule,
    PaymentModule,
  ],
  controllers: [AppController],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: CustomCacheInterceptor,
  //   },
  // ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}
