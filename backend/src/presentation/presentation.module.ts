import { Module } from '@nestjs/common';
import { ExTableModule } from './ex-module/ex-table.module';
import { ApplicationModule } from '../application/application.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [CqrsModule, ApplicationModule, ExTableModule, TransactionModule],
  exports: [ExTableModule],
})
export class PresentationModule {}
