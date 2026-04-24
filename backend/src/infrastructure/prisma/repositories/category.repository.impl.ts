import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
    ICategoryRepository, CreateCategoryData, UpdateCategoryData, CategoryData,
} from '../../../domain/category/category.repository';

@Injectable()
export class CategoryRepositoryImpl implements ICategoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateCategoryData): Promise<CategoryData> {
        const result = await this.prisma.category.create({
            data: {
                name: data.name,
            },
        });
        return {
            id: result.id,
            name: result.name,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt,
        };
    }


    async findById(id: string): Promise<CategoryData | null> {
        const result = await this.prisma.category.findFirst({
            where: { id, deletedAt: null },
        });
        if (!result) return null;
        return {
            id: result.id,
            name: result.name,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt,
        };
    }

    async findAll(): Promise<CategoryData[]> {
        const results = await this.prisma.category.findMany({
            where: { deletedAt: null },
        });
        return results.map(result => ({
            id: result.id,
            name: result.name,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt,
        }));
    }

    async update(id: string, data: UpdateCategoryData): Promise<CategoryData> {
        const result = await this.prisma.category.update({
            where: { id },
            data: {
                name: data.name,

            },
        });
        return {
            id: result.id,
            name: result.name,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt,
        };
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async findByName(name: string): Promise<CategoryData | null> {
        const result = await this.prisma.category.findFirst({
            where: { name, deletedAt: null },
        });
        if (!result) return null;
        return {
            id: result.id,
            name: result.name,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt,
        };
    }
}