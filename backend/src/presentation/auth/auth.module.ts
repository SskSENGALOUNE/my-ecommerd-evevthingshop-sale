import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthApplicationModule } from '../../application/auth/auth-application.module';
import { AuthInfrastructureModule } from '../../infrastructure/auth/auth-infrastructure.module';

@Module({
  imports: [CqrsModule, AuthApplicationModule, AuthInfrastructureModule],
  controllers: [AuthController],
})
export class AuthModule {}
