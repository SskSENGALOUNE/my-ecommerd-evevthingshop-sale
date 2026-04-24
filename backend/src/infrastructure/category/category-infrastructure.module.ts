import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryRepositoryImpl } from '../prisma/repositories/category.repository.impl';
import { CATEGORY_REPOSITORY } from '../../domain/category/category.repository';

@Module({
    imports: [PrismaModule],
    providers: [{ provide: CATEGORY_REPOSITORY, useClass: CategoryRepositoryImpl }],
    exports: [CATEGORY_REPOSITORY],
})
export class CategoryInfrastructureModule { }