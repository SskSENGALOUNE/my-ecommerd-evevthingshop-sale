import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateExTableDto } from './dto/create-ex-table.dto';
import { UpdateExTableDto } from './dto/update-ex-table.dto';
import { ExTableResponseDto } from './dto/ex-table-response.dto';
import {
  CreateExTableCommand,
  UpdateExTableCommand,
  DeleteExTableCommand,
} from '../../application/ex-module/commands';
import {
  GetExTableByIdQuery,
  GetAllExTablesQuery,
} from '../../application/ex-module/queries';

@ApiTags('ex-tables')
@Controller('ex-tables')
export class ExTableController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ExTable record' })
  @ApiBody({ type: CreateExTableDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ExTableResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() dto: CreateExTableDto): Promise<ExTableResponseDto> {
    const command = new CreateExTableCommand(dto.name, dto.createdBy);
    return await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ExTable records' })
  @ApiResponse({
    status: 200,
    description: 'Return all records.',
    type: [ExTableResponseDto],
  })
  async findAll(): Promise<ExTableResponseDto[]> {
    const query = new GetAllExTablesQuery();
    return await this.queryBus.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ExTable record by ID' })
  @ApiParam({ name: 'id', description: 'ExTable UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Return the record.',
    type: ExTableResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(@Param('id') id: string): Promise<ExTableResponseDto> {
    const query = new GetExTableByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an ExTable record' })
  @ApiParam({ name: 'id', description: 'ExTable UUID', type: 'string' })
  @ApiBody({ type: UpdateExTableDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ExTableResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExTableDto,
  ): Promise<ExTableResponseDto> {
    const command = new UpdateExTableCommand(id, dto.name || '', dto.updatedBy);
    return await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an ExTable record' })
  @ApiParam({ name: 'id', description: 'ExTable UUID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async remove(@Param('id') id: string) {
    const command = new DeleteExTableCommand(id);
    await this.commandBus.execute(command);
  }
}
