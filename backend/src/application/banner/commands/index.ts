import { CreateBannerHandler } from "./create-banner.handler";
import { UpdateBannerHandler } from "./update-banner.handler";
import { DeleteBannerHandler } from "./delete-banner.handler";

export const BannerCommandHandlers = [
  CreateBannerHandler,
  UpdateBannerHandler,
  DeleteBannerHandler,
];
