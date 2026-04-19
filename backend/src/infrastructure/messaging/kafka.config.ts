import { Partitioners } from 'kafkajs';

// Export a function instead of a const so it's evaluated lazily
// This ensures dotenv has loaded before we read process.env
export function getKafkaConfig() {
  const clientId = process.env.KAFKA_CLIENT_ID;
  const brokers = process.env.KAFKA_BROKERS;
  const groupId = process.env.KAFKA_GROUP_ID;

  if (!brokers || brokers.trim() === '') {
    throw new Error('KAFKA_BROKERS environment variable is required and cannot be empty');
  }

  return {
    client: {
      clientId: clientId ?? 'pos-payment-gateway',
      brokers: brokers.split(',').filter(broker => broker.trim() !== ''),
    },

    consumer: {
      groupId: groupId ?? 'pos-payment-gateway-group',
    },

    producer: {
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.LegacyPartitioner,
    },
  };
}