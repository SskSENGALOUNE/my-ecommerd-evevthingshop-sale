import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateExTableCommand } from './update-ex-table.command';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';
import { ExTable } from '../../../domain/ex-module/ex-table.entity';

@CommandHandler(UpdateExTableCommand)
export class UpdateExTableHandler implements ICommandHandler<UpdateExTableCommand> {
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(command: UpdateExTableCommand) {
    const existing = await this.repository.findById(command.id);
    
    if (!existing) {
      throw new NotFoundException(`ExTable with id ${command.id} not found`);
    }

    const exTable = ExTable.reconstitute(
      existing.id,
      existing.name,
      existing.createdAt,
      existing.createdBy,
      existing.updatedAt,
      existing.updatedBy,
    );

    const updateData = exTable.update(command.name, command.updatedBy);

    const result = await this.repository.update(command.id, {
      name: updateData.name,
      updatedBy: updateData.updatedBy!,
    });

    return result;
  }
}
