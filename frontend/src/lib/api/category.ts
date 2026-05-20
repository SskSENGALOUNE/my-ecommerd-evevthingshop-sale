import { apiClient } from "./client";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

// Public — ไม่ต้อง token
export async function getPublicCategories(): Promise<Category[]> {
  const response = await apiClient<{ success: boolean; data: Category[] }>(
    "/categories",
    { method: "GET" }
  );
  return response.data || [];
}

// Admin
export async function getCategories(token: string): Promise<Category[]> {
  const response = await apiClient<{ success: boolean; data: Category[] }>(
    "/admin/categories",
    { method: "GET", token },
  );
  return response.data || [];
}

export async function getCategoryById(
  id: string,
  token: string,
): Promise<Category> {
  const response = await apiClient<{ success: boolean; data: Category }>(
    `/admin/categories/${id}`,
    { method: "GET", token },
  );
  return response.data;
}

export async function createCategory(
  data: CreateCategoryRequest,
  token: string,
): Promise<Category> {
  return apiClient<Category>("/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
  token: string,
): Promise<Category> {
  return apiClient<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  await apiClient<void>(`/admin/categories/${id}`, {
    method: "DELETE",
    token,
  });
}
