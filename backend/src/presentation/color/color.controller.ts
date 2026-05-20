import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAdminGuard } from "../auth/guards/jwt-admin.guard";
import { CreateColorCommand } from "../../application/color/commands/create-color.command";
import { UpdateColorCommand } from "../../application/color/commands/update-color.command";
import { DeleteColorCommand } from "../../application/color/commands/delete-color.command";
import { GetAllColorsQuery } from "../../application/color/queries/get-all-colors.query";
import { GetColorByIdQuery } from "../../application/color/queries/get-color-by-id.query";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { ColorResponseDto } from "./dto/color-response.dto";

@ApiTags("admin/colors")
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller("admin/colors")
export class ColorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create Color" })
  @ApiResponse({
    status: 201,
    description: "Color created successfully",
    type: ColorResponseDto,
  })
  async create(@Body() dto: CreateColorDto) {
    const command = new CreateColorCommand(dto.color);
    return await this.commandBus.execute(command);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get All Colors" })
  @ApiResponse({
    status: 200,
    description: "Get all colors successfully",
    type: [ColorResponseDto],
  })
  async findAll() {
    const query = new GetAllColorsQuery();
    return await this.queryBus.execute(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Color By Id" })
  @ApiResponse({
    status: 200,
    description: "Get color successfully",
    type: ColorResponseDto,
  })
  async findById(@Param("id") id: string) {
    const query = new GetColorByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update Color" })
  @ApiResponse({
    status: 200,
    description: "Color updated successfully",
    type: ColorResponseDto,
  })
  async update(@Param("id") id: string, @Body() dto: UpdateColorDto) {
    const command = new UpdateColorCommand(id, dto.color, dto.isActive);
    return await this.commandBus.execute(command);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete Color" })
  @ApiResponse({
    status: 204,
    description: "Color deleted successfully",
  })
  async delete(@Param("id") id: string) {
    const command = new DeleteColorCommand(id);
    return await this.commandBus.execute(command);
  }
}
