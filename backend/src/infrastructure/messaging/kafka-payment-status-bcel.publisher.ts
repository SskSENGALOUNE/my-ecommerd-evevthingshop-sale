import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { KafkaClient } from './kafka.client';
import { PaymentStatusBCELPublisher } from 'src/application/payment/ports/payment-status-bcel.publisher';
import { PaymentStatus } from 'src/domain/payment/payment-status-bcel.dto';

@Injectable()
export class KafkaPaymentStatusBCELPublisher
  implements PaymentStatusBCELPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly producer: ReturnType<KafkaClient['createProducer']>;

  constructor(private readonly kafka: KafkaClient) {
    this.producer = this.kafka.createProducer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async publishPaymentStatus(event: PaymentStatus): Promise<void> {
    const topic = 'payment.status.bcel';
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });
  }
}
