import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { UpdateBannerCommand } from "./update-banner.command";
import * as bannerRepository from "../../../domain/banner/banner.repository";
import { BaseCommandResult } from "../../common/base-command-result";

@CommandHandler(UpdateBannerCommand)
export class UpdateBannerHandler implements ICommandHandler<UpdateBannerCommand> {
  constructor(
    @Inject(bannerRepository.BANNER_REPOSITORY)
    private readonly repository: bannerRepository.IBannerRepository,
  ) {}

  async execute(command: UpdateBannerCommand): Promise<BaseCommandResult> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(`Banner with id ${command.id} not found`);
    }

    const updated = await this.repository.update(command.id, {
      title: command.title,
      imageUrl: command.imageUrl,
      linkUrl: command.linkUrl,
      isActive: command.isActive,
      order: command.order,
    });
    return {
      id: updated.id,
      title: updated.title,
      imageUrl: updated.imageUrl,
      linkUrl: updated.linkUrl,
      isActive: updated.isActive,
      order: updated.order,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      deletedAt: updated.deletedAt,
    };
  }
}
