import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBannerDto {
  @ApiPropertyOptional({ description: 'ชื่อ Banner', example: 'Banner ลดราคา' })
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  title?: string;

  @ApiPropertyOptional({ description: 'URL รูปภาพ', example: 'https://...' })
  @IsOptional()
  @IsString({ message: 'imageUrl must be a string' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'URL ลิงก์', example: 'https://...' })
  @IsOptional()
  @IsString({ message: 'linkUrl must be a string' })
  linkUrl?: string;

  @ApiPropertyOptional({ description: 'สถานะการใช้งาน', example: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'ลำดับการแสดง', example: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'order must be a number' })
  order?: number;
}
