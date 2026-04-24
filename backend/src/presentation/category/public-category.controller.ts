import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllCategoriesQuery } from "../../application/category/queries/get-all-categories.query";
import { GetCategoryByIdQuery } from "../../application/category/queries/get-id-categories.query";

@ApiTags("categories")
@Controller("categories")
export class PublicCategoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get All Categories (Public)" })
  @ApiResponse({ status: 200, description: "Get All Categories success" })
  async findAll() {
    return await this.queryBus.execute(new GetAllCategoriesQuery());
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Category By Id (Public)" })
  @ApiResponse({ status: 200, description: "Get Category By Id success" })
  async findById(@Param("id") id: string) {
    return await this.queryBus.execute(new GetCategoryByIdQuery(id));
  }
}
