import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { UpdateColorCommand } from "./update-color.command";
import * as colorRepository from "../../../domain/color/color.repository";
import { BaseCommandResult } from "../../common/base-command-result";

@CommandHandler(UpdateColorCommand)
export class UpdateColorHandler implements ICommandHandler<UpdateColorCommand> {
  constructor(
    @Inject(colorRepository.COLOR_REPOSITORY)
    private readonly repository: colorRepository.IColorRepository,
  ) {}

  async execute(command: UpdateColorCommand): Promise<BaseCommandResult> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException("Color not found");
    }

    const updated = await this.repository.update(command.id, {
      color: command.color,
      isActive: command.isActive,
    });
    return {
      id: updated.id,
      color: updated.color,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
