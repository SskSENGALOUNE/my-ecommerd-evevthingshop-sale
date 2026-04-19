// detect-db-engine.ts
import { DatabaseEngine } from './db-engine';

export function detectDatabaseEngines(): DatabaseEngine[] {
  const engines: DatabaseEngine[] = [];

  const url = process.env.DATABASE_URL;

  if (url?.startsWith('postgresql://')) {
    engines.push(DatabaseEngine.POSTGRES);
  }

  if (url?.startsWith('mysql://')) {
    engines.push(DatabaseEngine.MYSQL);
  }

  if (url?.startsWith('sqlserver://')) {
    engines.push(DatabaseEngine.SQLSERVER);
  }

  if (process.env.MONGO_URL) {
    engines.push(DatabaseEngine.MONGO);
  }

  return Array.from(new Set(engines));
}
