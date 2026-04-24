import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException, Inject } from "@nestjs/common";
import { UpdateCategoryCommand } from "./update-category.command";
import * as categoryRepository from "../../../domain/category/category.repository";
import { BaseCommandResult } from "../../common/base-command-result";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject(categoryRepository.CATEGORY_REPOSITORY)
    private readonly repository: categoryRepository.ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<BaseCommandResult> {
    const category = await this.repository.findById(command.id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (command.name) {
      const existing = await this.repository.findByName(command.name);
      if (existing && existing.id !== command.id) {
        throw new ConflictException("Category name already exists");
      }
    }
    return await this.repository.update(command.id, { name: command.name });
  }
}
