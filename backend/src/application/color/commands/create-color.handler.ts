import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateColorCommand } from './create-color.command';
import * as colorRepository from '../../../domain/color/color.repository';
import { Color } from '../../../domain/color/color.entity';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateColorCommand)
export class CreateColorHandler implements ICommandHandler<CreateColorCommand> {
  constructor(
    @Inject(colorRepository.COLOR_REPOSITORY)
    private readonly repository: colorRepository.IColorRepository,
  ) {}

  async execute(command: CreateColorCommand): Promise<BaseCommandResult> {
    const existing = await this.repository.findByColor(command.color);
    if (existing) {
      throw new ConflictException('Color already exists');
    }

    const color = Color.create(command.color);
    const created = await this.repository.create({
      color: color.color,
      isActive: color.isActive,
    });
    return {
      id: created.id,
      color: created.color,
      isActive: created.isActive,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
