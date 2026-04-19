import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTransactionsPaginatedQuery } from './get-transactions-paginated.query';
import { TRANSECTION_REPOSITORY } from 'src/domain/transaction/transaction.repository';
import type { TransactionRepository } from 'src/domain/transaction/transaction.repository';

@QueryHandler(GetTransactionsPaginatedQuery)
export class GetTransactionsPaginatedHandler
  implements IQueryHandler<GetTransactionsPaginatedQuery>
{
  constructor(
    @Inject(TRANSECTION_REPOSITORY)
    private readonly repository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionsPaginatedQuery) {
    return await this.repository.findWithPagination({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
  }
}