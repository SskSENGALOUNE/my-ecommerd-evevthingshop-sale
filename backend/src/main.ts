import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// Load .env FIRST before any other imports that might read process.env
dotenvConfig({ path: resolve(__dirname, '..', '.env'), override: true });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor, nestLogger } from './utilities/interceptor/logger';
import { BaseResponseInterceptor } from './presentation/interceptors/base-response.interceptor';
import { BaseErrorInterceptor } from './presentation/interceptors/base-error.interceptor';
import { TimeoutInterceptor } from './presentation/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,         // ตัด field ที่ไม่ได้กำหนดใน DTO ออก
    forbidNonWhitelisted: true, // ส่ง field แปลกมา = error
    transform: true,         // แปลง type อัตโนมัติ
  }));


  app.useGlobalInterceptors(
    new LoggingInterceptor({ serviceName: 'payment-center' }),
    new BaseResponseInterceptor(),
    new BaseErrorInterceptor(),
    new TimeoutInterceptor(),
  );
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Clean Architecture NestJS API')
    .setDescription('API documentation for Clean Architecture NestJS template with CQRS')
    .setVersion('1.0')
    .addTag('health')
    .addTag('auth')
    .addTag('ex-tables')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}

void bootstrap();
