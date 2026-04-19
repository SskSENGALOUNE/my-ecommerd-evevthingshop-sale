import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionsPaginatedHandler } from '../../../src/application/transaction/queries/get-transactions-paginated.handler';
import { GetTransactionsPaginatedQuery } from '../../../src/application/transaction/queries/get-transactions-paginated.query';
import { TRANSECTION_REPOSITORY } from '../../../src/domain/transaction/transaction.repository';
import { TransactionEntity } from '../../../src/domain/transaction/transaction-entity';

describe('GetTransactionsPaginatedHandler', () => {
  let handler: GetTransactionsPaginatedHandler;
  let mockRepository: any;

  const mockTransactionEntity = TransactionEntity.reconstitute(
    '1',
    'TXN001',
    'MERCHANT001',
    'ORDER001',
    'Test Merchant',
    1000,
    'SUCCESS',
    '{"amount": 1000}',
    '{"status": "approved"}',
    '{"request": "data"}',
    'VISA',
    new Date('2024-01-01'),
  );

  const mockPaginationResult = {
    data: [mockTransactionEntity],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(async () => {
    mockRepository = {
      findWithPagination: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionsPaginatedHandler,
        {
          provide: TRANSECTION_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetTransactionsPaginatedHandler>(GetTransactionsPaginatedHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute query and return paginated transactions', async () => {
    mockRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

    const query = new GetTransactionsPaginatedQuery(1, 10, 'SUCCESS');
    const result = await handler.execute(query);

    expect(mockRepository.findWithPagination).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: 'SUCCESS',
    });
    expect(result).toEqual(mockPaginationResult);
  });

  it('should execute query without status filter', async () => {
    mockRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

    const query = new GetTransactionsPaginatedQuery(1, 10);
    await handler.execute(query);

    expect(mockRepository.findWithPagination).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: undefined,
    });
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database error');
    mockRepository.findWithPagination.mockRejectedValue(error);

    const query = new GetTransactionsPaginatedQuery(1, 10);

    await expect(handler.execute(query)).rejects.toThrow('Database error');
  });
});