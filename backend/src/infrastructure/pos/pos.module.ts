import { Module } from '@nestjs/common';
import { PosExternalApiRepositoryAdapter } from './pos-external-api-repository.adapter';

@Module({
  providers: [PosExternalApiRepositoryAdapter],
  exports: [PosExternalApiRepositoryAdapter],
})
export class PosModule {}
