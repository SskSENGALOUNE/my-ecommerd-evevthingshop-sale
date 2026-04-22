import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { JwtCustomerStrategy } from './strategies/jwt-customer.strategy';

@Module({
  imports: [PassportModule],
  providers: [JwtAdminStrategy, JwtCustomerStrategy],
  exports: [JwtAdminStrategy, JwtCustomerStrategy],
})
export class AuthInfrastructureModule {}
