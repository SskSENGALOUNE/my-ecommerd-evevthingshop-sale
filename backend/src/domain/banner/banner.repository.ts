export interface IBannerRepository {
  create(data: CreateBannerData): Promise<BannerData>;
  findById(id: string): Promise<BannerData | null>;
  findAll(): Promise<BannerData[]>;
  update(id: string, data: UpdateBannerData): Promise<BannerData>;
  delete(id: string): Promise<void>;
}

export interface CreateBannerData {
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBannerData {
  title?: string;
  imageUrl?: string;
  linkUrl?: string | null;
  isActive?: boolean;
  order?: number;
}

export interface BannerData {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const BANNER_REPOSITORY = Symbol("BANNER_REPOSITORY");
