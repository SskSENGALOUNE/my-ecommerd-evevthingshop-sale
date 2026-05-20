import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CustomerGoogleLoginDto {
  @ApiProperty({ description: "Supabase access token from Google OAuth" })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
