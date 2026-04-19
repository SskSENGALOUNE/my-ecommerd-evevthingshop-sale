import { TransactionEntity } from "./transaction-entity";

export interface TransactionRepository {
    findAll(): Promise<TransactionEntity[]>;
    findWithPagination(params: PaginationParams): Promise<PaginationResult<TransactionEntity>>;
    getTotalSummary(): Promise<{
        totalTransaction: number;
        totalPending: number;
        totalMerchants: number;
        totalFailed: number;
        totalAmount: number;
        dailySales: Array<{ day: string; amount: number }>;
        failedTransactions: Array<{ transactionId: string; status: string }>;
    }>;
}

export interface PaginationParams {
    page: number;
    limit: number;
    status?: string;
}

export interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const TRANSECTION_REPOSITORY = Symbol('TRANSECTION_REPOSITORY');
