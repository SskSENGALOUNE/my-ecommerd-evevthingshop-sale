import { PaymentStatus } from '../../../domain/payment/payment-status-bcel.dto';

export const PAYMENT_STATUS_BCEL_PUBLISHER = Symbol(
  'PaymentStatusBCELPublisher',
);

export interface PaymentStatusBCELPublisher {
  publishPaymentStatus(event: PaymentStatus): Promise<void>;
}
