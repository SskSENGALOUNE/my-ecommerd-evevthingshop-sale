// mongo.strategy.ts
import { MongoClient, Db, Collection } from 'mongodb';
import { DbHealthChecker } from './db-health-checker.port';
import { DbHealthResult } from './db-health-result';

export class MongoHealthAdapter implements DbHealthChecker {
  private client: MongoClient;

  constructor(private readonly mongoUrl: string) {
    this.client = new MongoClient(mongoUrl);
  }

  async check(): Promise<DbHealthResult> {
    let db: Db;
    let collection: Collection;

    try {
      // CONNECT
      await this.client.connect();
      db = this.client.db();

      collection = db.collection('health_test');

      // INSERT
      await collection.insertOne({ value: 1 });

      // SELECT
      await collection.findOne({ value: 1 });

      // UPDATE
      await collection.updateOne({ value: 1 }, { $set: { value: 2 } });

      // DELETE
      await collection.deleteMany({});

      return {
        engine: 'mongo',
        status: 'ok',
        permissions: {
          select: true,
          insert: true,
          update: true,
          delete: true,
        },
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);

      return {
        engine: 'mongo',
        status: 'error',
        error: errorMessage,
      };
    } finally {
      // CLEANUP
      try {
        await this.client.close();
      } catch {
        /* ignore */
      }
    }
  }
}
