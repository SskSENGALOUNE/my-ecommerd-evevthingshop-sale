import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ description: 'ชื่อ Banner', example: 'Banner ลดราคา' })
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @ApiProperty({ description: 'URL รูปภาพ', example: 'https://...' })
  @IsNotEmpty({ message: 'imageUrl is required' })
  @IsString({ message: 'imageUrl must be a string' })
  imageUrl: string;

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
