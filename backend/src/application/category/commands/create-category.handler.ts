import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateCategoryCommand } from './create-category.command';
import * as categoryRepository from '../../../domain/category/category.repository';
import { Category } from '../../../domain/category/category.entity';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
    constructor(
        @Inject(categoryRepository.CATEGORY_REPOSITORY)
        private readonly repository: categoryRepository.ICategoryRepository,
    ) { }

    async execute(command: CreateCategoryCommand): Promise<BaseCommandResult> {
        const existing = await this.repository.findByName(command.name);
        if (existing) {
            throw new ConflictException('Category name already exists');
        }

        const category = Category.create(command.name);
        const created = await this.repository.create({ name: category.name });
        return {
            id: created.id,
            name: created.name,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
            deletedAt: created.deletedAt,
        };
    }




}