import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteExTableCommand } from './delete-ex-table.command';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';

@CommandHandler(DeleteExTableCommand)
export class DeleteExTableHandler
  implements ICommandHandler<DeleteExTableCommand>
{
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(command: DeleteExTableCommand) {
    const existing = await this.repository.findById(command.id);
    
    if (!existing) {
      throw new NotFoundException(`ExTable with id ${command.id} not found`);
    }

    await this.repository.delete(command.id);
  }
}
