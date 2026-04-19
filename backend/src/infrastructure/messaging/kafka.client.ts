import {
  Kafka,
  Producer,
  Consumer,
  KafkaConfig,
  ProducerConfig,
  ConsumerConfig,
} from 'kafkajs';
import { getKafkaConfig } from './kafka.config';

type KafkaClientConfig = {
  client: KafkaConfig;
  producer?: ProducerConfig;
  consumer: ConsumerConfig;
};

export class KafkaClient {
  private readonly kafka: Kafka;

  constructor() {
    const config = getKafkaConfig();
    this.kafka = new Kafka(config.client);
  }

  createProducer(): Producer {
    const config = getKafkaConfig();
    return this.kafka.producer(config.producer);
  }

  createConsumer(): Consumer {
    const config = getKafkaConfig();
    return this.kafka.consumer(config.consumer);
  }
}
