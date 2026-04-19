import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IExTableRepository,
  CreateExTableData,
  UpdateExTableData,
  ExTableData,
} from '../../../domain/ex-module/ex-table.repository';

@Injectable()
export class ExTableRepositoryImpl implements IExTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExTableData): Promise<ExTableData> {
    const result = await this.prisma.exTable.create({
      data: {
        name: data.name,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
    });

    return {
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      createdBy: result.createdBy,
      updatedAt: result.updatedAt,
      updatedBy: result.updatedBy,
    };
  }

  async findById(id: string): Promise<ExTableData | null> {
    const result = await this.prisma.exTable.findUnique({
      where: { id },
    });

    return result ? {
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      createdBy: result.createdBy,
      updatedAt: result.updatedAt,
      updatedBy: result.updatedBy,
    } : null;
  }

  async findAll(): Promise<ExTableData[]> {
    const results = await this.prisma.exTable.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return results.map((result) => ({
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      createdBy: result.createdBy,
      updatedAt: result.updatedAt,
      updatedBy: result.updatedBy,
    }));
  }

  async update(id: string, data: UpdateExTableData): Promise<ExTableData> {
    const result = await this.prisma.exTable.update({
      where: { id },
      data: {
        name: data.name,
        updatedBy: data.updatedBy,
      },
    });

    return {
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      createdBy: result.createdBy,
      updatedAt: result.updatedAt,
      updatedBy: result.updatedBy,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exTable.delete({
      where: { id },
    });
  }
}
