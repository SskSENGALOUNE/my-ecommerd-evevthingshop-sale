import { EventsHandler } from '@nestjs/cqrs';
import { PaymentChangeStatusEvent } from './payment-status-change.event';

@EventsHandler(PaymentChangeStatusEvent)
export class NotifyMerchantPaymentStatusChangedHandler {
  // Handler implementation goes here
  async handle(event: PaymentChangeStatusEvent) {
    // TODO : push to merchant API,
    const currency = event.paymentStatusBCEL.currency;
  }
}
