import { GetTransactionsPaginatedQuery } from '../../../src/application/transaction/queries/get-transactions-paginated.query';

describe('GetTransactionsPaginatedQuery', () => {
  it('should create query with all parameters', () => {
    const query = new GetTransactionsPaginatedQuery(1, 10, 'SUCCESS');

    expect(query.page).toBe(1);
    expect(query.limit).toBe(10);
    expect(query.status).toBe('SUCCESS');
  });

  it('should create query without status parameter', () => {
    const query = new GetTransactionsPaginatedQuery(2, 20);

    expect(query.page).toBe(2);
    expect(query.limit).toBe(20);
    expect(query.status).toBeUndefined();
  });

  it('should handle different page and limit values', () => {
    const query = new GetTransactionsPaginatedQuery(5, 50, 'PENDING');

    expect(query.page).toBe(5);
    expect(query.limit).toBe(50);
    expect(query.status).toBe('PENDING');
  });
});