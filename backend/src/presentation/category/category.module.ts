import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CategoryController } from "./category.controller";
import { ApplicationModule } from "../../application/application.module";
import { CreateCategoryHandler } from "../../application/category/commands/create-category.handler";
import { DeleteCategoryHandler } from "../../application/category/commands/delete-category.handler";
import { GetAllCategoriesHandler } from "../../application/category/queries/get-all-categories.handler";
import { GetCategoryByIdHandler } from "../../application/category/queries/get-id-categories.handler";
import { CATEGORY_REPOSITORY } from "src/domain/category/category.repository";
import { CategoryRepositoryImpl } from "src/infrastructure/prisma/repositories/category.repository.impl";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UpdateCategoryHandler } from "../../application/category/commands/update-category.handler";
import { PublicCategoryController } from "./public-category.controller";

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];
const QueryHandlers = [GetAllCategoriesHandler, GetCategoryByIdHandler];

@Module({
  imports: [CqrsModule, ApplicationModule, PrismaModule],
  controllers: [CategoryController, PublicCategoryController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepositoryImpl },
  ],
})
export class CategoryModule {}
