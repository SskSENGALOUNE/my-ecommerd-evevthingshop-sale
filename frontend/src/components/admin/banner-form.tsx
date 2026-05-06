"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAdminToken } from "@/lib/api/auth";
import {
  createBanner,
  updateBanner,
  Banner,
  CreateBannerRequest,
  UpdateBannerRequest,
} from "@/lib/api/banner";
import { ChevronLeft } from "lucide-react";

interface BannerFormProps {
  banner?: Banner;
  mode: "create" | "edit";
}

export function BannerForm({ banner, mode }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    imageUrl: banner?.imageUrl || "",
    linkUrl: banner?.linkUrl || "",
    isActive: banner?.isActive ?? true,
    order: banner?.order ?? 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value, 10)
            : value,
    });
  };

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
        const data: CreateBannerRequest = {
          title: formData.title,
          imageUrl: formData.imageUrl,
          linkUrl: formData.linkUrl || undefined,
          isActive: formData.isActive,
          order: formData.order,
        };
        await createBanner(data, token);
      } else if (banner) {
        const data: UpdateBannerRequest = {
          title: formData.title !== banner.title ? formData.title : undefined,
          imageUrl:
            formData.imageUrl !== banner.imageUrl
              ? formData.imageUrl
              : undefined,
          linkUrl:
            formData.linkUrl !== (banner.linkUrl || "")
              ? formData.linkUrl || undefined
              : undefined,
          isActive:
            formData.isActive !== banner.isActive
              ? formData.isActive
              : undefined,
          order:
            formData.order !== banner.order ? formData.order : undefined,
        };
        await updateBanner(banner.id, data, token);
      }

      router.push("/admin/banners");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ banner"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/banners" className="mb-6 inline-flex items-center gap-2">
        <ChevronLeft className="size-4" />
        <span>ກັບໄປ</span>
      </Link>

      <h1 className="mb-2 text-2xl font-bold">
        {mode === "create" ? "ສ້າງ Banner ໃໝ່" : "ແກ້ໄຂ Banner"}
      </h1>
      <p className="mb-6 text-muted-foreground">
        {mode === "create"
          ? "ສ້າງ banner ໃໝ່ສໍາລັບສະແດງຢູ່ຫນ້າຕໍ່າງ"
          : "ແກ້ໄຂຂໍ້ມູນ banner"}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            ຊື່ Banner <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="ໃສ່ຊື່ banner"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            ລິ້ງຮູບພາບ <span className="text-destructive">*</span>
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          {formData.imageUrl && (
            <div className="mt-3 rounded-lg border overflow-hidden relative h-64">
              <Image
                src={formData.imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Link */}
        <div>
          <label className="mb-2 block text-sm font-medium">ລິ້ງ</label>
          <input
            type="url"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>

        {/* Order */}
        <div>
          <label className="mb-2 block text-sm font-medium">ລຳດັບ</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            ລຳດັບສະແດງ (0 = ທໍາອິດ)
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border cursor-pointer"
          />
          <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
            ເປີດໃຊ້ banner
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </Button>
          <Link href="/admin/banners" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              ຍົກເລີກ
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
