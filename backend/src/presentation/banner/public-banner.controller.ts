import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllBannersQuery } from '../../application/banner/queries/get-all-banners.query';
import { GetBannerByIdQuery } from '../../application/banner/queries/get-banner-by-id.query';
import { BannerResponseDto } from './dto/banner-response.dto';

@ApiTags('banners')
@Controller('banners')
export class PublicBannerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All Banners (Public)' })
  @ApiResponse({ status: 200, description: 'Get all banners successfully', type: [BannerResponseDto] })
  async findAll() {
    return await this.queryBus.execute(new GetAllBannersQuery());
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Banner By Id (Public)' })
  @ApiResponse({ status: 200, description: 'Get banner successfully', type: BannerResponseDto })
  async findById(@Param('id') id: string) {
    return await this.queryBus.execute(new GetBannerByIdQuery(id));
  }
}
