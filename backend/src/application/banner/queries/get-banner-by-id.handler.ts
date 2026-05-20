import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetBannerByIdQuery } from "./get-banner-by-id.query";
import * as bannerRepository from "../../../domain/banner/banner.repository";
import { Inject, NotFoundException } from "@nestjs/common";

@QueryHandler(GetBannerByIdQuery)
export class GetBannerByIdHandler implements IQueryHandler<GetBannerByIdQuery> {
  constructor(
    @Inject(bannerRepository.BANNER_REPOSITORY)
    private readonly repository: bannerRepository.IBannerRepository,
  ) {}

  async execute(
    query: GetBannerByIdQuery,
  ): Promise<bannerRepository.BannerData> {
    const banner = await this.repository.findById(query.id);
    if (!banner) {
      throw new NotFoundException(`Banner with id ${query.id} not found`);
    }
    return banner;
  }
}
