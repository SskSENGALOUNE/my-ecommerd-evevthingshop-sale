import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BannerController } from './banner.controller';
import { PublicBannerController } from './public-banner.controller';
import { ApplicationModule } from '../../application/application.module';
import { BannerCommandHandlers } from '../../application/banner/commands';
import { BannerQueryHandlers } from '../../application/banner/queries';
import { BANNER_REPOSITORY } from 'src/domain/banner/banner.repository';
import { BannerRepositoryImpl } from 'src/infrastructure/prisma/repositories/banner.repository.impl';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';

@Module({
  imports: [CqrsModule, ApplicationModule, PrismaModule],
  controllers: [BannerController, PublicBannerController],
  providers: [
    ...BannerCommandHandlers,
    ...BannerQueryHandlers,
    { provide: BANNER_REPOSITORY, useClass: BannerRepositoryImpl },
  ],
})
export class BannerModule {}
