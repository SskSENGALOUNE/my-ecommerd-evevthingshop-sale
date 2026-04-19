import { Module } from '@nestjs/common';
import { KafkaClient } from './kafka.client';
import { KafkaPaymentStatusBCELPublisher } from './kafka-payment-status-bcel.publisher';
import { KafkaPaymentStatusBCELConsumer } from './kafka-payment-status-bcel.consumer';
import { PAYMENT_STATUS_BCEL_PUBLISHER } from '../../application/payment/ports/payment-status-bcel.publisher';

@Module({
  providers: [
    KafkaClient,
    {
      provide: PAYMENT_STATUS_BCEL_PUBLISHER,
      useClass: KafkaPaymentStatusBCELPublisher,
    },
    KafkaPaymentStatusBCELConsumer,
  ],
  exports: [PAYMENT_STATUS_BCEL_PUBLISHER, KafkaPaymentStatusBCELConsumer],
})
export class KafkaModule {}
