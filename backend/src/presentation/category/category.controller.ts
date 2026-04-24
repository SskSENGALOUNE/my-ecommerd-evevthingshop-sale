import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Put, Delete, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '../../application/category/commands/create-category.command';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryCommand } from 'src/application/category/commands/update-category.command';
import { DeleteCategoryCommand } from 'src/application/category/commands/delete-category.command';
import { GetAllCategoriesQuery } from 'src/application/category/queries/get-all-categories.query';
import { GetCategoryByIdQuery } from 'src/application/category/queries/get-id-categories.query';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';


@ApiTags('admin/categories')
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller('admin/categories')
export class CategoryController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus

    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create Category' })
    @ApiResponse({ status: 201, description: 'Create Category success', type: CategoryResponseDto })
    async create(@Body() dto: CreateCategoryDto) {
        const command = new CreateCategoryCommand(
            dto.name
        );
        return await this.commandBus.execute(command);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get All Categories' })
    @ApiResponse({ status: 200, description: 'Get All Categories success', type: [CategoryResponseDto] })
    async findAll() {
        const query = new GetAllCategoriesQuery();
        return await this.queryBus.execute(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get Category By Id' })
    @ApiResponse({ status: 200, description: 'Get Category By Id success', type: CategoryResponseDto })
    async findById(@Param('id') id: string) {
        const query = new GetCategoryByIdQuery(id);
        return await this.queryBus.execute(query);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update Category' })
    @ApiResponse({ status: 200, description: 'Update Category success', type: CategoryResponseDto })
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        const command = new UpdateCategoryCommand(
            id,
            dto.name
        );
        return await this.commandBus.execute(command);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete Category' })
    @ApiResponse({ status: 204, description: 'Delete Category success' })
    async delete(@Param('id') id: string) {
        const command = new DeleteCategoryCommand(id);
        return await this.commandBus.execute(command);
    }
}