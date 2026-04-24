import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
    @ApiPropertyOptional({ description: 'ชื่อหมวดหมู่', example: 'เสื้อผ้า' })
    @IsOptional()
    @IsString()
    name?: string;
}