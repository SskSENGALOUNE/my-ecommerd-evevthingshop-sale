import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteColorCommand } from './delete-color.command';
import * as colorRepository from '../../../domain/color/color.repository';

@CommandHandler(DeleteColorCommand)
export class DeleteColorHandler implements ICommandHandler<DeleteColorCommand> {
  constructor(
    @Inject(colorRepository.COLOR_REPOSITORY)
    private readonly repository: colorRepository.IColorRepository,
  ) {}

  async execute(command: DeleteColorCommand): Promise<void> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('Color not found');
    }
    await this.repository.delete(command.id);
  }
}
