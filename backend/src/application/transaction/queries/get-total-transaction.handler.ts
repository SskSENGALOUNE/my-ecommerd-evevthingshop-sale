// src/application/transaction/get-total-transaction.handler.ts

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTotalTransactionQuery } from './get-total-transaction.query';
import { GetTotalTransactionResponseDto } from '../../../presentation/transaction/dto/get-total-transaction-response.dto';
import type { TransactionRepository } from '../../../domain/transaction/transaction.repository';
import { TRANSECTION_REPOSITORY } from '../../../domain/transaction/transaction.repository';
import { mapDomainErrorToResponse } from 'src/presentation/common/responses/map-domain-error-response.helper';
import { CustomNotFoundException } from 'src/domain/exceptions/exception-custom-notfound';

@QueryHandler(GetTotalTransactionQuery)
export class GetTotalTransactionHandler implements IQueryHandler<GetTotalTransactionQuery> {
  constructor(
    @Inject(TRANSECTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(
    query: GetTotalTransactionQuery,
  ): Promise<GetTotalTransactionResponseDto> {
    // throw new CustomNotFoundException('Method not implemented.');
    const summary = await this.transactionRepository.getTotalSummary();

    return {
      summary: {
        totalTransaction: summary.totalTransaction,
        totalPendingTransaction: summary.totalPending,
        totalMerchant: summary.totalMerchants,
        totalFailureNotification: summary.totalFailed,
        totalAmountSales: { value: summary.totalAmount, currency: 'LAK' },
      },
      amountSalesChart: {
        currency: 'LAK',
        total: summary.totalAmount,
        data: summary.dailySales,
      },
      failureNotifications: {
        total: summary.totalFailed,
        transactions: summary.failedTransactions,
      },
    };
  }
}
