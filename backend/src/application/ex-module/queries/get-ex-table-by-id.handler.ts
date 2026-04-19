import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetExTableByIdQuery } from './get-ex-table-by-id.query';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';

@QueryHandler(GetExTableByIdQuery)
export class GetExTableByIdHandler
  implements IQueryHandler<GetExTableByIdQuery>
{
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(query: GetExTableByIdQuery) {
    const result = await this.repository.findById(query.id);

    if (!result) {
      throw new NotFoundException(`ExTable with id ${query.id} not found`);
    }

    return result;
  }
}
