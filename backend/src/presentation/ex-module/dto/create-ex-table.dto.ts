import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExTableDto {
  @ApiProperty({
    description: 'Name of the record',
    example: 'Example Name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 'user-123',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
