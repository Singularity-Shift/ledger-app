import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const uri = app
    .get<ConfigService>(ConfigService)
    .get<string>('autoBackendApi.url');

  const port = app
    .get<ConfigService>(ConfigService)
    .get<string>('autoBackendApi.port');

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // CORS
  app.enableCors({
    origin: true, // This accepts the Origin header from the request
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // DTO validation for every request
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(port as string, uri as string);
  logger.log(`Application is running on port ${process.env.PORT ?? 3050}`);
}

bootstrap();
