import { GetAllColorsHandler } from './get-all-colors.handler';
import { GetAllColorsQuery } from './get-all-colors.query';
import type { IColorRepository } from '../../../domain/color/color.repository';

describe('GetAllColorsHandler', () => {
  let handler: GetAllColorsHandler;
  let repo: jest.Mocked<IColorRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByColor: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    handler = new GetAllColorsHandler(repo);
  });

  it('returns all colors', async () => {
    const colors = [
      {
        id: 'uuid-1',
        color: 'RED',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'uuid-2',
        color: 'BLUE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    repo.findAll.mockResolvedValue(colors);

    const result = await handler.execute(new GetAllColorsQuery());

    expect(result).toHaveLength(2);
    expect(result[0].color).toBe('RED');
    expect(result[1].color).toBe('BLUE');
  });

  it('returns empty array when no colors exist', async () => {
    repo.findAll.mockResolvedValue([]);

    const result = await handler.execute(new GetAllColorsQuery());

    expect(result).toEqual([]);
  });
});
