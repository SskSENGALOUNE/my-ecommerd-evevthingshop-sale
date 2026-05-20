import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateBannerCommand } from "../../application/banner/commands/create-banner.command";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { BannerResponseDto } from "./dto/banner-response.dto";
import { UpdateBannerCommand } from "src/application/banner/commands/update-banner.command";
import { DeleteBannerCommand } from "src/application/banner/commands/delete-banner.command";
import { GetAllBannersQuery } from "src/application/banner/queries/get-all-banners.query";
import { GetBannerByIdQuery } from "src/application/banner/queries/get-banner-by-id.query";
import { JwtAdminGuard } from "../auth/guards/jwt-admin.guard";

@ApiTags("admin/banners")
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller("admin/banners")
export class BannerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create Banner" })
  @ApiResponse({
    status: 201,
    description: "Banner created successfully",
    type: BannerResponseDto,
  })
  async create(@Body() dto: CreateBannerDto) {
    const command = new CreateBannerCommand(
      dto.title,
      dto.imageUrl,
      dto.linkUrl,
      dto.isActive,
      dto.order,
    );
    return await this.commandBus.execute(command);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get All Banners" })
  @ApiResponse({
    status: 200,
    description: "Get all banners successfully",
    type: [BannerResponseDto],
  })
  async findAll() {
    const query = new GetAllBannersQuery();
    return await this.queryBus.execute(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Banner By Id" })
  @ApiResponse({
    status: 200,
    description: "Get banner successfully",
    type: BannerResponseDto,
  })
  async findById(@Param("id") id: string) {
    const query = new GetBannerByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update Banner" })
  @ApiResponse({
    status: 200,
    description: "Banner updated successfully",
    type: BannerResponseDto,
  })
  async update(@Param("id") id: string, @Body() dto: UpdateBannerDto) {
    const command = new UpdateBannerCommand(
      id,
      dto.title,
      dto.imageUrl,
      dto.linkUrl,
      dto.isActive,
      dto.order,
    );
    return await this.commandBus.execute(command);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete Banner" })
  @ApiResponse({ status: 200, description: "Banner deleted successfully" })
  async delete(@Param("id") id: string) {
    const command = new DeleteBannerCommand(id);
    return await this.commandBus.execute(command);
  }
}
