import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExTableRepositoryImpl } from '../prisma/repositories/ex-table.repository.impl';
import { EX_TABLE_REPOSITORY } from '../../domain/ex-module/ex-table.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: EX_TABLE_REPOSITORY,
      useClass: ExTableRepositoryImpl,
    },
  ],
  exports: [EX_TABLE_REPOSITORY],
})
export class ExModuleInfrastructureModule {}
