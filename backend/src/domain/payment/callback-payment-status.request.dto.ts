import { PaymentStatus } from './payment-status.enum';
// this class used to define the structure of the callback payment status request data transfer object (DTO).
// For merchant to receive payment status updates from payment gateway.
export class CallBackPaymentStatusRequestDto {
  constructor(
    public readonly transactionId: string,
    public readonly status: PaymentStatus,
    public readonly amount: number,
    public readonly txttime: Date,
  ) {}
}
