import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';
import { ApplicationModule } from './application/application.module';
import { SharedModule } from './shared/shared.module';
import { HealthService } from './utilities/health-check/health.service';
import { DatabaseHealthService } from './utilities/health-check/database-health.service';
import { AuthModule } from './presentation/auth/auth.module';
import { JwtAuthGuard } from './presentation/auth/guards/jwt-auth.guard';

function detectDatabaseType(url: string): DatabaseType {
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    return 'postgres';
  }
  if (url.startsWith('mysql://')) {
    return 'mysql';
  }
  if (url.startsWith('mongodb://')) {
    return 'mongodb';
  }
  if (url.startsWith('mssql://') || url.startsWith('sqlserver://')) {
    return 'mssql';
  }

  throw new Error('Unsupported database type in DATABASE_URL');
}

function getTypeOrmImports() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn(
      'DATABASE_URL not found. Skipping TypeOrmModule configuration.',
    );
    return [];
  }

  return [
    TypeOrmModule.forRoot({
      type: detectDatabaseType(databaseUrl),
      url: databaseUrl,
      synchronize: false,
      logging: false,
    }),
  ];
}

@Module({
  imports: [...getTypeOrmImports(), InfrastructureModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    HealthService,
    DatabaseHealthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
