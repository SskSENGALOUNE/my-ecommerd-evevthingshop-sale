import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IBannerRepository,
  CreateBannerData,
  UpdateBannerData,
  BannerData,
} from '../../../domain/banner/banner.repository';

@Injectable()
export class BannerRepositoryImpl implements IBannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBannerData): Promise<BannerData> {
    const result = await this.prisma.banner.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    });
    return this.mapToBannerData(result);
  }

  async findById(id: string): Promise<BannerData | null> {
    const result = await this.prisma.banner.findFirst({
      where: { id, deletedAt: null },
    });
    if (!result) return null;
    return this.mapToBannerData(result);
  }

  async findAll(): Promise<BannerData[]> {
    const results = await this.prisma.banner.findMany({
      where: { deletedAt: null },
      orderBy: { order: 'asc' },
    });
    return results.map((result) => this.mapToBannerData(result));
  }

  async update(id: string, data: UpdateBannerData): Promise<BannerData> {
    const result = await this.prisma.banner.update({
      where: { id },
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        isActive: data.isActive,
        order: data.order,
      },
    });
    return this.mapToBannerData(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.banner.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private mapToBannerData(result: any): BannerData {
    return {
      id: result.id,
      title: result.title,
      imageUrl: result.imageUrl,
      linkUrl: result.linkUrl,
      isActive: result.isActive,
      order: result.order,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      deletedAt: result.deletedAt,
    };
  }
}
