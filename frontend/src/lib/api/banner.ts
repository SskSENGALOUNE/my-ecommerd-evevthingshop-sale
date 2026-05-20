import { apiClient } from "./client";

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateBannerRequest {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBannerRequest {
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive?: boolean;
  order?: number;
}

export interface BannerResponse {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Public — ไม่ต้อง token
export async function getPublicBanners(): Promise<Banner[]> {
  const response = await apiClient<{ success: boolean; data: Banner[] }>(
    "/banners",
    { method: "GET" }
  );
  return response.data || [];
}

// Admin
export async function getBanners(token: string): Promise<Banner[]> {
  const response = await apiClient<{ success: boolean; data: Banner[] }>(
    "/banners",
    { method: "GET", token }
  );
  return response.data || [];
}

export async function getBannerById(
  id: string,
  token: string
): Promise<Banner> {
  const response = await apiClient<{ success: boolean; data: Banner }>(
    `/banners/${id}`,
    {
      method: "GET",
      token,
    }
  );
  return response.data;
}

export async function createBanner(
  data: CreateBannerRequest,
  token: string
): Promise<BannerResponse> {
  return apiClient<BannerResponse>(`/admin/banners`, {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateBanner(
  id: string,
  data: UpdateBannerRequest,
  token: string
): Promise<BannerResponse> {
  return apiClient<BannerResponse>(`/admin/banners/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteBanner(
  id: string,
  token: string
): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/admin/banners/${id}`, {
    method: "DELETE",
    token,
  });
}
