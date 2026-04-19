import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExTableDto {
  @ApiPropertyOptional({
    description: 'Name of the record',
    example: 'Updated Name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User ID who updated this record',
    example: 'user-123',
  })
  @IsNotEmpty()
  @IsString()
  updatedBy: string;
}
