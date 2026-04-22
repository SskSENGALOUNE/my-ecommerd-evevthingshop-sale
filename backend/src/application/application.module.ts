import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionApplicationModule } from './transaction/transaction-application.module';
import { AuthApplicationModule } from './auth/auth-application.module';

@Module({
  imports: [CqrsModule, TransactionApplicationModule, AuthApplicationModule],
  exports: [CqrsModule, TransactionApplicationModule, AuthApplicationModule],
})
export class ApplicationModule {}
