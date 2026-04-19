import { DbHealthResult } from './db-health-result';

export interface DbHealthChecker {
  check(): Promise<DbHealthResult>;
}
