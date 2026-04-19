import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllExTablesQuery } from './get-all-ex-tables.query';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';
import { ExTable } from '@prisma/client';

@QueryHandler(GetAllExTablesQuery)
export class GetAllExTablesHandler implements IQueryHandler<GetAllExTablesQuery> {
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(): Promise<ExTable[]> {
    return await this.repository.findAll();
  }
}
