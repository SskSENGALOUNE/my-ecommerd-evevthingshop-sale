import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteCategoryCommand } from './delete-category.command';
import * as categoryRepository from '../../../domain/category/category.repository';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
    constructor(
        @Inject(categoryRepository.CATEGORY_REPOSITORY)
        private readonly repository: categoryRepository.ICategoryRepository,
    ) { }

    async execute(command: DeleteCategoryCommand): Promise<BaseCommandResult> {
        const category = await this.repository.findById(command.id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        await this.repository.delete(command.id);
        return { id: command.id };
    }
}
