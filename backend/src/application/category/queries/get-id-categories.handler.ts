import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCategoryByIdQuery } from "./get-id-categories.query";
import { Inject, NotFoundException } from "@nestjs/common";
import {
  CATEGORY_REPOSITORY,
  type CategoryData,
  type ICategoryRepository,
} from "src/domain/category/category.repository";

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repository: ICategoryRepository,
  ) {}

  async execute(query: GetCategoryByIdQuery): Promise<CategoryData | null> {
    const category = await this.repository.findById(query.id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }
}
