"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAdminToken } from "@/lib/api/auth";
import { getCategories, deleteCategory, Category } from "@/lib/api/category";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      if (!token) {
        toast.error("ກະລຸນາ login ກ່ອນ");
        return;
      }
      const data = await getCategories(token);
      setCategories(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການໂຫລດ",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ທ່ານແນ່ໃຈບໍ? ຈະລົບ "${name}"?`)) return;
    try {
      const token = getAdminToken();
      if (!token) return;
      await deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(`ລົບ "${name}" ສຳເລັດ`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການລົບ");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ຈັດການໝວດໝູ່</h1>
          <p className="mt-1 text-muted-foreground">ໝວດໝູ່ສິນຄ້າທັງໝົດ</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            ສ້າງໝວດໝູ່ໃໝ່
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">ກຳລັງໂຫລດ...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          ບໍ່ມີໝວດໝູ່
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">ຊື່ໝວດໝູ່</th>
                <th className="px-4 py-3 text-left font-medium">ວັນທີ່ສ້າງ</th>
                <th className="px-4 py-3 text-right font-medium">ຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString("lo-LA")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil className="size-3" />
                          ແກ້ໄຂ
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        <Trash2 className="size-3" />
                        ລົບ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
