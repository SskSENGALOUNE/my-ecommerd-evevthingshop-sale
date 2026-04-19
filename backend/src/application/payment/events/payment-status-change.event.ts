import { PaymentStatus } from 'src/domain/payment/payment-status-bcel.dto';

export class PaymentChangeStatusEvent {
  constructor(public readonly paymentStatusBCEL: PaymentStatus) {}
}
