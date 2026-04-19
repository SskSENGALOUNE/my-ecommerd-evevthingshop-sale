import { DataSource } from 'typeorm';
import { DbHealthResult } from './db-health-result';
import { DbHealthChecker } from './db-health-checker.port';

// sqlserver.strategy.ts
export class SqlServerHealthAdapter implements DbHealthChecker {
  constructor(private readonly ds: DataSource) {}

  async check(): Promise<DbHealthResult> {
    const qr = this.ds.createQueryRunner();
    await qr.connect();

    try {
      await qr.startTransaction();

      await qr.query(`SELECT 1`);
      await qr.query(`
        CREATE TABLE #health_test(id INT)
      `);
      await qr.query(`INSERT INTO #health_test VALUES (1)`);
      await qr.query(`UPDATE #health_test SET id = 2`);
      await qr.query(`DELETE FROM #health_test`);

      await qr.rollbackTransaction();

      return {
        engine: 'sqlserver',
        status: 'ok',
        permissions: {
          select: true,
          insert: true,
          update: true,
          delete: true,
        },
      };
    } catch (e) {
      await qr.rollbackTransaction();
      return { engine: 'sqlserver', status: 'error', error: e.message };
    } finally {
      await qr.release();
    }
  }
}
