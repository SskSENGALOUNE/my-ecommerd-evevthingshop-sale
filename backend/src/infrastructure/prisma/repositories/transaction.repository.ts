import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Status } from '@prisma/client';
import { TransactionEntity } from 'src/domain/transaction/transaction-entity';
import { PaginationParams, PaginationResult, TransactionRepository as ITransactionRepository } from 'src/domain/transaction/transaction.repository';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalSummary() {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [totalTransaction, totalPending, totalMerchants, totalFailed, totalAmount, salesData, failedData] = await Promise.all([
      this.prisma.transactions.count(),
      this.prisma.transactions.count({ where: { status: 'PENDING' } }),
      this.prisma.transactions.groupBy({ by: ['merchant_id'] }).then(result => result.length),
      this.prisma.transactions.count({ where: { status: 'FAILED' } }),
      this.prisma.transactions.aggregate({ _sum: { amount: true } }),
      this.prisma.transactions.groupBy({
        by: ['created_at'],
        _sum: { amount: true },
        where: { created_at: { gte: startOfWeek } },
        orderBy: { created_at: 'asc' }
      }),
      this.prisma.transactions.findMany({
        where: { status: 'FAILED' },
        select: { transaction_id: true, status: true },
        orderBy: { created_at: 'desc' }
      })
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailySales = Array.from({ length: 7 }, (_, i) => ({ day: dayNames[i], amount: 0 }));
    
    salesData.forEach(item => {
      const dayIndex = new Date(item.created_at).getDay();
      dailySales[dayIndex].amount += item._sum?.amount || 0;
    });

    const failedTransactions = failedData.map(item => ({
      transactionId: item.transaction_id,
      status: item.status
    }));

    return {
      totalTransaction,
      totalPending,
      totalMerchants,
      totalFailed,
      totalAmount: totalAmount._sum.amount || 0,
      dailySales,
      failedTransactions
    };
  }

  async findAll(): Promise<TransactionEntity[]> {
    const results = await this.prisma.transactions.findMany({
      orderBy: { created_at: 'desc' },
    });

    return results.map((result) => 
      TransactionEntity.reconstitute(
        result.id,
        result.transaction_id,
        result.merchant_id,
        result.order_id,
        result.merchant_name,
        result.amount,
        result.status,
        result.post_request,
        result.bank_response,
        result.bank_request,
        result.bank_type,
        result.created_at,
      )
    );
  }

  async findWithPagination(params: PaginationParams): Promise<PaginationResult<TransactionEntity>> {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const where = status && Object.values(Status).includes(status as Status)
      ? { status: status as Status }
      : {};

    const [results, total] = await Promise.all([
      this.prisma.transactions.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.transactions.count({ where }),
    ]);

    const data = results.map((result) =>
      TransactionEntity.reconstitute(
        result.id,
        result.transaction_id,
        result.merchant_id,
        result.order_id,
        result.merchant_name,
        result.amount,
        result.status,
        result.post_request,
        result.bank_response,
        result.bank_request,
        result.bank_type,
        result.created_at,
      )
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}