import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: 'seasoner' })
    name: string;

    @ApiPropertyOptional({ example: '2022-01-01T00:00:00.000Z' })
    createdAt?: Date;

    @ApiPropertyOptional({ example: '2022-01-01T00:00:00.000Z' })
    updatedAt?: Date;

    @ApiPropertyOptional({ example: '2022-01-01T00:00:00.000Z' })
    deletedAt?: Date;
}