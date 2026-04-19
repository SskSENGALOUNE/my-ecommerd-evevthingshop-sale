import { ApiProperty } from '@nestjs/swagger';

export class ExTableResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the record',
    example: 'Example Name',
  })
  name: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-05T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 'user-123',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-05T12:45:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID who last updated this record',
    example: 'user-456',
  })
  updatedBy: string;
}
