import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateColorDto {
  @ApiPropertyOptional({
    example: 'BLUE',
    description: 'Color name (enum value)',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Is color active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
