export class PaymentStatus {
  constructor(
    public readonly transactionId: string,
    public readonly status: 'pending' | 'completed' | 'failed',
    public readonly amount: number,
    public readonly currency: string,
    public readonly timestamp: Date,
    public readonly metadata?: Record<string, any>,
  ) {}
}
