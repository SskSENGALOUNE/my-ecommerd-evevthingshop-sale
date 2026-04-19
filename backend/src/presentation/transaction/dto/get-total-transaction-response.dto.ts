export interface DailySalesData {
    day: string;
    amount: number;
}

export interface FailedTransactionData {
    transactionId: string;
    status: string;
}

export interface AmountValue {
    value: number;
    currency: string;
}

export interface SummaryData {
    totalTransaction: number;
    totalPendingTransaction: number;
    totalMerchant: number;
    totalFailureNotification: number;
    totalAmountSales: AmountValue;
}

export interface AmountSalesChart {
    currency: string;
    total: number;
    data: DailySalesData[];
}

export interface FailureNotifications {
    total: number;
    transactions: FailedTransactionData[];
}

export interface GetTotalTransactionResponseDto {
    summary: SummaryData;
    amountSalesChart: AmountSalesChart;
    failureNotifications: FailureNotifications;
}
