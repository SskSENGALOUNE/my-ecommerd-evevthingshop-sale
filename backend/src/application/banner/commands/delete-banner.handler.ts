import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { DeleteBannerCommand } from "./delete-banner.command";
import * as bannerRepository from "../../../domain/banner/banner.repository";

@CommandHandler(DeleteBannerCommand)
export class DeleteBannerHandler implements ICommandHandler<DeleteBannerCommand> {
  constructor(
    @Inject(bannerRepository.BANNER_REPOSITORY)
    private readonly repository: bannerRepository.IBannerRepository,
  ) {}

  async execute(command: DeleteBannerCommand): Promise<{ success: boolean }> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(`Banner with id ${command.id} not found`);
    }

    await this.repository.delete(command.id);
    return { success: true };
  }
}
