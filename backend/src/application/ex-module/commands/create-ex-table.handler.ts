import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateExTableCommand } from './create-ex-table.command';
import * as exTableRepository from '../../../domain/ex-module/ex-table.repository';
import { ExTable } from '../../../domain/ex-module/ex-table.entity';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateExTableCommand)
export class CreateExTableHandler implements ICommandHandler<CreateExTableCommand> {
  constructor(
    @Inject(exTableRepository.EX_TABLE_REPOSITORY)
    private readonly repository: exTableRepository.IExTableRepository,
  ) {}

  async execute(command: CreateExTableCommand): Promise<BaseCommandResult> {
    const exTable = ExTable.create(command.name, command.createdBy);

    const createdExTable = await this.repository.create({
      name: exTable.name,
      createdBy: exTable.createdBy,
      updatedBy: exTable.updatedBy,
    });

    return {
      id: createdExTable.id,
    };
  }
}
