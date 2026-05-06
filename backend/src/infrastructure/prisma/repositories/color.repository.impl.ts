import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IColorRepository,
  CreateColorData,
  UpdateColorData,
  ColorData,
} from '../../../domain/color/color.repository';

@Injectable()
export class ColorRepositoryImpl implements IColorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateColorData): Promise<ColorData> {
    const color = await this.prisma.color.create({
      data: {
        color: data.color,
        isActive: data.isActive ?? true,
      },
    });
    return this.mapToColorData(color);
  }

  async findById(id: string): Promise<ColorData | null> {
    const color = await this.prisma.color.findUnique({
      where: { id },
    });
    return color ? this.mapToColorData(color) : null;
  }

  async findAll(): Promise<ColorData[]> {
    const colors = await this.prisma.color.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return colors.map((color) => this.mapToColorData(color));
  }

  async update(id: string, data: UpdateColorData): Promise<ColorData> {
    const color = await this.prisma.color.update({
      where: { id },
      data: {
        ...(data.color !== undefined && { color: data.color }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return this.mapToColorData(color);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.color.delete({
      where: { id },
    });
  }

  async findByColor(color: string): Promise<ColorData | null> {
    const result = await this.prisma.color.findUnique({
      where: { color: color as any },
    });
    return result ? this.mapToColorData(result) : null;
  }

  private mapToColorData(color: any): ColorData {
    return {
      id: color.id,
      color: color.color,
      isActive: color.isActive,
      createdAt: color.createdAt,
      updatedAt: color.updatedAt,
    };
  }
}
