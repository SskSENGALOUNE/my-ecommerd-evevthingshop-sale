import { ApiProperty } from '@nestjs/swagger';

export class ColorResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'RED' })
  color: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-05-06T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-05-06T10:00:00Z' })
  updatedAt: Date;
}
