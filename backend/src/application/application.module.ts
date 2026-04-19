import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionApplicationModule } from './transaction/transaction-application.module';

@Module({
  imports: [CqrsModule, TransactionApplicationModule],
  exports: [CqrsModule, TransactionApplicationModule],
})
export class ApplicationModule {}
