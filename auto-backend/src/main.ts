import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Validate required environment variables
  if (!process.env.OPENAI_API_KEY) {
    logger.error('Missing required environment variable: OPENAI_API_KEY');
    process.exit(1);
  }
  
  // Validate Google credentials file exists
  const credentialsPath = path.resolve(process.cwd(), 'sshiftdao-ai-8c84658189d0.json');
  if (!fs.existsSync(credentialsPath)) {
    logger.error(`Google Cloud credentials file not found at: ${credentialsPath}`);
    process.exit(1);
  }
  
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // CORS
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? ['http://localhost:5173', 'http://127.0.0.1:5173']
        : (process.env.ALLOW_ORIGIN ?? '*'),
    methods: ['POST', 'OPTIONS'],
    maxAge: 86_400,
  });

  // DTO validation for every request
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(process.env.PORT ?? 3050, '0.0.0.0');
  logger.log(`Application is running on port ${process.env.PORT ?? 3050}`);
}
bootstrap();
