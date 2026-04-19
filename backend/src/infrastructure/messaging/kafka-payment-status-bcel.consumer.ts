import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { KafkaClient } from './kafka.client';
import { Consumer } from 'kafkajs';

@Injectable()
export class KafkaPaymentStatusBCELConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly consumer: Consumer;
  private readonly logger = new Logger(KafkaPaymentStatusBCELConsumer.name);

  constructor(private readonly kafka: KafkaClient) {
    this.consumer = this.kafka.createConsumer();
  }

  async onModuleInit() {
    const isKafkaEnabled = process.env.KAFKA_ENABLED === 'true';
    
    if (!isKafkaEnabled) {
      this.logger.log('Kafka is disabled, skipping consumer initialization');
      return;
    }

    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: 'payment.status.bcel',
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const value = message.value?.toString();
            if (!value) {
              this.logger.warn('Received empty message');
              return;
            }

            const event = JSON.parse(value);
            this.logger.log(
              `Received payment status event: ${JSON.stringify(event)}`,
            );

            // Process the event here
            await this.handlePaymentStatusEvent(event);
          } catch (error) {
            this.logger.error(
              `Error processing message: ${error instanceof Error ? error.message : error}`,
            );
          }
        },
      });

      this.logger.log('Kafka consumer started for topic: payment.status.bcel');
    } catch (error) {
      this.logger.error(
        `Failed to initialize Kafka consumer: ${error instanceof Error ? error.message : error}`,
      );
      // Don't throw the error to prevent the application from crashing
    }
  }

  async onModuleDestroy() {
    const isKafkaEnabled = process.env.KAFKA_ENABLED === 'true';
    
    if (!isKafkaEnabled) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.logger.log('Kafka consumer disconnected');
    } catch (error) {
      this.logger.error(
        `Error disconnecting Kafka consumer: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  private async handlePaymentStatusEvent(event: any): Promise<void> {
    // Implement your business logic here
    // This could call a command handler, repository, etc.
    this.logger.debug(`Processing payment event: ${event.transactionId}`);
  }
}
