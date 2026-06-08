import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import expressBasicAuth from 'express-basic-auth';
import { AppModule } from 'src/modules/app.module';
import { EnvService } from 'src/modules/env/env.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { TransformResponseInterceptor } from './interceptor/response.interceptor';
import { AppValidationPipe } from './pipes/app-validation.pipe';

async function bootstrap() {
  const logger = new Logger('App-Log');
  logger.log(`App Launcher.... 🚀 `);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
    cors: true,
    logger: new LoggerService(),
  });

  const env = app.get(EnvService);

  app.useBodyParser('json', { limit: '25mb' });
  app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
  app.useGlobalPipes(new XSSFilterPipe());
  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.setGlobalPrefix(env.API_VERSION);
  if (env.SWAGGER_OPEN) {
    if (!env.SWAGGER_LOCKED) {
      app.use(
        `${env.API_VERSION ? `/${env.API_VERSION}` : ''}/docs/`,
        (_req: Request, _res: Response, next: NextFunction) => {
          next();
        },
      );
    } else {
      app.use(
        `/${env.API_VERSION}/docs/`,
        expressBasicAuth({
          users: { [env.SWAGGER_USER]: env.SWAGGER_PASSWORD },
          challenge: true,
        }),
      );
    }

    const options = new DocumentBuilder()
      .setTitle(`${env.APP_NAME} API`)
      .setDescription(`${env.APP_NAME} API Documentation`)
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${env.API_VERSION}/docs`, app, document);
  }

  await app.listen(env.PORT);
  logger.log(
    `App Launcher Success: http://localhost:${env.PORT}/${env.API_VERSION}/docs 🚀 `,
  );
}
bootstrap().catch((err) => {
  console.error(`Error: ${err}`);
});
