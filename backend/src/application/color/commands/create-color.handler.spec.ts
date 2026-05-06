import { ConflictException } from '@nestjs/common';
import { CreateColorHandler } from './create-color.handler';
import { CreateColorCommand } from './create-color.command';
import type { IColorRepository } from '../../../domain/color/color.repository';

describe('CreateColorHandler', () => {
  let handler: CreateColorHandler;
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
    handler = new CreateColorHandler(repo);
  });

  it('creates color when color is unique', async () => {
    repo.findByColor.mockResolvedValue(null);
    repo.create.mockResolvedValue({
      id: 'uuid-1',
      color: 'RED',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler.execute(new CreateColorCommand('RED'));

    expect(result.id).toBe('uuid-1');
    expect(result.color).toBe('RED');
    expect(result.isActive).toBe(true);
    expect(repo.create).toHaveBeenCalledWith({
      color: 'RED',
      isActive: true,
    });
  });

  it('throws ConflictException when color exists', async () => {
    repo.findByColor.mockResolvedValue({
      id: 'uuid-1',
      color: 'RED',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      handler.execute(new CreateColorCommand('RED')),
    ).rejects.toThrow(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
  });
});
