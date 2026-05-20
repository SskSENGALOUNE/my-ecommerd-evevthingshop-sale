import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CreateBannerCommand } from "./create-banner.command";
import * as bannerRepository from "../../../domain/banner/banner.repository";
import { Banner } from "../../../domain/banner/banner.entity";
import { BaseCommandResult } from "../../common/base-command-result";

@CommandHandler(CreateBannerCommand)
export class CreateBannerHandler implements ICommandHandler<CreateBannerCommand> {
  constructor(
    @Inject(bannerRepository.BANNER_REPOSITORY)
    private readonly repository: bannerRepository.IBannerRepository,
  ) {}

  async execute(command: CreateBannerCommand): Promise<BaseCommandResult> {
    const banner = Banner.create(
      command.title,
      command.imageUrl,
      command.linkUrl,
      command.isActive,
      command.order,
    );
    const created = await this.repository.create({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      isActive: banner.isActive,
      order: banner.order,
    });
    return {
      id: created.id,
      title: created.title,
      imageUrl: created.imageUrl,
      linkUrl: created.linkUrl,
      isActive: created.isActive,
      order: created.order,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt,
    };
  }
}
