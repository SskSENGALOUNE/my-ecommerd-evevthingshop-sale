import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllBannersQuery } from "./get-all-banners.query";
import * as bannerRepository from "../../../domain/banner/banner.repository";
import { Inject } from "@nestjs/common";

@QueryHandler(GetAllBannersQuery)
export class GetAllBannersHandler implements IQueryHandler<GetAllBannersQuery> {
  constructor(
    @Inject(bannerRepository.BANNER_REPOSITORY)
    private readonly repository: bannerRepository.IBannerRepository,
  ) {}

  async execute(
    query: GetAllBannersQuery,
  ): Promise<bannerRepository.BannerData[]> {
    const banners = await this.repository.findAll();
    return banners;
  }
}
