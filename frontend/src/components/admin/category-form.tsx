"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAdminToken } from "@/lib/api/auth";
import { createCategory, updateCategory, Category } from "@/lib/api/category";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormProps {
  category?: Category;
  mode: "create" | "edit";
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(category?.name || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = getAdminToken();
      if (!token) {
        setError("ກະລຸນາ login ກ່ອນ");
        return;
      }

      if (mode === "create") {
        await createCategory({ name }, token);
      } else if (category) {
        await updateCategory(category.id, { name }, token);
      }

      toast.success(mode === "create" ? "ສ້າງໝວດໝູ່ສຳເລັດ" : "ແກ້ໄຂສຳເລັດ");
      router.push("/admin/categories");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/admin/categories"
        className="mb-6 inline-flex items-center gap-2"
      >
        <ChevronLeft className="size-4" />
        <span>ກັບໄປ</span>
      </Link>

      <h1 className="mb-2 text-2xl font-bold">
        {mode === "create" ? "ສ້າງໝວດໝູ່ໃໝ່" : "ແກ້ໄຂໝວດໝູ່"}
      </h1>
      <p className="mb-6 text-muted-foreground">
        {mode === "create" ? "ເພີ່ມໝວດໝູ່ສິນຄ້າໃໝ່" : "ແກ້ໄຂຊື່ໝວດໝູ່"}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            ຊື່ໝວດໝູ່ <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ເຊັ່ນ: ເຄື່ອງໃຊ້ໃນຄົວ"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </Button>
          <Link href="/admin/categories" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              ຍົກເລີກ
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
