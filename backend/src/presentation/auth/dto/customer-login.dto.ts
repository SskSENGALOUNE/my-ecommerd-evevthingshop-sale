import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerLoginDto {
  @ApiProperty({ example: 'customer@shop.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Customer@1234' })
  @IsString()
  @MinLength(6)
  password: string;
}
