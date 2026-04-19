import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LoginHandler, RegisterHandler } from '../../application/auth/commands';
import { JwtStrategy } from '../../infrastructure/auth/jwt.strategy';
import { UserRepositoryImpl } from '../../infrastructure/prisma/repositories/user.repository.impl';
import { USER_REPOSITORY } from '../../domain/user/user.repository';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_change_me',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginHandler,
    RegisterHandler,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [JwtModule, USER_REPOSITORY],
})
export class AuthModule {}
