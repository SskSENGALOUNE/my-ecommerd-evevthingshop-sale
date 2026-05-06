import { ApiProperty } from '@nestjs/swagger';

export class BannerResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Banner ลดราคา' })
  title: string;

  @ApiProperty({ example: 'https://...' })
  imageUrl: string;

  @ApiProperty({ example: 'https://...', nullable: true })
  linkUrl: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}
