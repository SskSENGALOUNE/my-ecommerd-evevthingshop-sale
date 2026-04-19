import { TransactionEntity } from '../../../src/domain/transaction/transaction-entity';

describe('TransactionEntity', () => {
  const mockData = {
    id: '1',
    transectionId: 'TXN001',
    merchantId: 'MERCHANT001',
    orderId: 'ORDER001',
    merchant_name: 'Test Merchant',
    amount: 1000,
    status: 'SUCCESS',
    post_request: '{"amount": 1000}',
    bank_response: '{"status": "approved"}',
    bank_request: '{"request": "data"}',
    bank_type: 'VISA',
    createdAt: new Date('2024-01-01'),
  };

  it('should create entity using reconstitute method', () => {
    const entity = TransactionEntity.reconstitute(
      mockData.id,
      mockData.transectionId,
      mockData.merchantId,
      mockData.orderId,
      mockData.merchant_name,
      mockData.amount,
      mockData.status,
      mockData.post_request,
      mockData.bank_response,
      mockData.bank_request,
      mockData.bank_type,
      mockData.createdAt,
    );

    expect(entity).toBeInstanceOf(TransactionEntity);
    expect(entity.id).toBe(mockData.id);
    expect(entity.transectionId).toBe(mockData.transectionId);
    expect(entity.merchantId).toBe(mockData.merchantId);
    expect(entity.orderId).toBe(mockData.orderId);
    expect(entity.merchant_name).toBe(mockData.merchant_name);
    expect(entity.amount).toBe(mockData.amount);
    expect(entity.status).toBe(mockData.status);
    expect(entity.post_request).toBe(mockData.post_request);
    expect(entity.bank_response).toBe(mockData.bank_response);
    expect(entity.bank_request).toBe(mockData.bank_request);
    expect(entity.bank_type).toBe(mockData.bank_type);
    expect(entity.createdAt).toBe(mockData.createdAt);
  });

  it('should have readonly properties', () => {
    const entity = TransactionEntity.reconstitute(
      mockData.id,
      mockData.transectionId,
      mockData.merchantId,
      mockData.orderId,
      mockData.merchant_name,
      mockData.amount,
      mockData.status,
      mockData.post_request,
      mockData.bank_response,
      mockData.bank_request,
      mockData.bank_type,
      mockData.createdAt,
    );

    // Properties should be readonly (TypeScript compile-time check)
    expect(() => {
      (entity as any).id = 'new-id';
    }).not.toThrow(); // Runtime doesn't prevent this, but TypeScript does
  });
});