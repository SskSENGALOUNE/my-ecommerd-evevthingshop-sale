import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetTransactionsPaginatedHandler } from './queries';
import { GetTotalTransactionHandler } from './queries/get-total-transaction.handler';
import { TRANSECTION_REPOSITORY } from '../../domain/transaction/transaction.repository';
import { TransactionRepository } from '../../infrastructure/prisma/repositories/transaction.repository';

const QueryHandlers = [GetTransactionsPaginatedHandler, GetTotalTransactionHandler];

@Module({
  imports: [CqrsModule],
  providers: [...QueryHandlers, 
    {
    provide: TRANSECTION_REPOSITORY,
    useClass: TransactionRepository, // Bind the symbol to the repository class
  },
],
  exports: [CqrsModule, ...QueryHandlers],
})
export class TransactionApplicationModule { }