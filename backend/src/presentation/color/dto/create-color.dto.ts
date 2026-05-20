import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateColorDto {
  @ApiProperty({
    example: "RED",
    description: "Color name (enum value)",
  })
  @IsNotEmpty()
  @IsString()
  color: string;
}
