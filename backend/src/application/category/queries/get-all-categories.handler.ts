import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllCategoriesQuery } from "./get-all-categories.query";
import * as categoryRepository from "../../../domain/category/category.repository";
import { Inject } from "@nestjs/common";

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery> {
    constructor(
        @Inject(categoryRepository.CATEGORY_REPOSITORY)
        private readonly repository: categoryRepository.ICategoryRepository,
    ) { }

    async execute(query: GetAllCategoriesQuery): Promise<categoryRepository.CategoryData[]> {
        const categories = await this.repository.findAll();
        return categories;
    }
}