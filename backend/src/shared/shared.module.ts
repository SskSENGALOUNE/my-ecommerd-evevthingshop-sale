import { Global, Module } from '@nestjs/common';
import { EX_TABLE_REPOSITORY } from '../domain/ex-module/ex-table.repository';
import { ExTableRepositoryImpl } from '../infrastructure/prisma/repositories/ex-table.repository.impl';

@Global()
@Module({
  providers: [
    {
      provide: EX_TABLE_REPOSITORY,
      useClass: ExTableRepositoryImpl,
    },
  ],
  exports: [EX_TABLE_REPOSITORY],
})
export class SharedModule {}