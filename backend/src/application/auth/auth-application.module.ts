import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminLoginHandler } from './commands/admin-login.handler';
import { CustomerLoginHandler } from './commands/customer-login.handler';
import { CustomerRegisterHandler } from './commands/customer-register.handler';

const commandHandlers = [AdminLoginHandler, CustomerLoginHandler, CustomerRegisterHandler];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_ADMIN_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any },
    }),
  ],
  providers: [
    ...commandHandlers,
    {
      provide: 'JWT_ADMIN_SERVICE',
      useFactory: () => {
        const { JwtService } = require('@nestjs/jwt');
        return new JwtService({
          secret: process.env.JWT_ADMIN_SECRET,
          signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any },
        });
      },
    },
    {
      provide: 'JWT_CUSTOMER_SERVICE',
      useFactory: () => {
        const { JwtService } = require('@nestjs/jwt');
        return new JwtService({
          secret: process.env.JWT_CUSTOMER_SECRET,
          signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any },
        });
      },
    },
  ],
  exports: [...commandHandlers, 'JWT_ADMIN_SERVICE', 'JWT_CUSTOMER_SERVICE'],
})
export class AuthApplicationModule { }
