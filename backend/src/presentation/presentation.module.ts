import { Module } from '@nestjs/common';
import { ExTableModule } from './ex-module/ex-table.module';
import { ApplicationModule } from '../application/application.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [CqrsModule, ApplicationModule, ExTableModule, TransactionModule, AuthModule, CategoryModule],
  exports: [ExTableModule, CategoryModule],
})
export class PresentationModule { }
