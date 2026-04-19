import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseEngine } from './db-engine';
import { DbHealthResult } from './db-health-result';
import { detectDatabaseEngines } from '../health-check/detect-db-engine';
import { PostgresHealthAdapter } from './postgres.adapter';
import { MysqlHealthAdapter } from './mysql.adapter';
import { SqlServerHealthAdapter } from './sqlserver.adapter';
import { MongoHealthAdapter } from './mongo.adapter';
import { DatabaseHealthPort } from './database-health.port';

@Injectable()
export class DatabaseHealthService implements DatabaseHealthPort {
  constructor(private readonly dataSource: DataSource) {}

  async checkAll(): Promise<DbHealthResult[]> {
    const engines = detectDatabaseEngines();
    const results: DbHealthResult[] = [];

    for (const engine of engines) {
      switch (engine) {
        case DatabaseEngine.POSTGRES: {
          const adapter = new PostgresHealthAdapter(this.dataSource);
          const result = await adapter.check();
          results.push(result as DbHealthResult);
          break;
        }

        case DatabaseEngine.MYSQL:
          results.push(
            (await new MysqlHealthAdapter(
              this.dataSource,
            ).check()) as DbHealthResult,
          );
          break;

        case DatabaseEngine.SQLSERVER:
          results.push(
            (await new SqlServerHealthAdapter(
              this.dataSource,
            ).check()) as DbHealthResult,
          );
          break;

        case DatabaseEngine.MONGO:
          results.push(
            (await new MongoHealthAdapter(
              process.env.DATABASE_URL!,
            ).check()) as DbHealthResult,
          );
          break;

        default:
          // Unsupported engine; skip
          break;
      }
    }

    return results;
  }
}
