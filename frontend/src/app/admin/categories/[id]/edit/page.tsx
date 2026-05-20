"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { getAdminToken } from "@/lib/api/auth";
import { getCategoryById, Category } from "@/lib/api/category";

export default function EditCategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategory = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      if (!token) {
        setError("ກະລຸນາ login ກ່ອນ");
        return;
      }
      const data = await getCategoryById(params.id as string, token);
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການໂຫລດ");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  if (loading) return <div className="text-center py-8">ກຳລັງໂຫລດ...</div>;
  if (error)
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  if (!category)
    return <div className="rounded-lg bg-muted p-4">ບໍ່ພົວໝວດໝູ່</div>;

  return <CategoryForm category={category} mode="edit" />;
}
