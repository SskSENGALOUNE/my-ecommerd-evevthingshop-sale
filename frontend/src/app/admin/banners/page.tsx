"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAdminToken } from "@/lib/api/auth";
import { getBanners, deleteBanner, Banner } from "@/lib/api/banner";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      if (!token) {
        setError("ກະລຸນາ login ກ່ອນ");
        return;
      }
      const response = await getBanners(token);
      setBanners(response || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການໂຫລດ banner"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleDelete = async (id: string) => {
    if (!confirm("ທ່ານແນ່ໃຈບໍ? ການລົບ banner ນີ້?")) return;

    try {
      const token = getAdminToken();
      if (!token) {
        setError("ກະລຸນາ login ກ່ອນ");
        return;
      }
      await deleteBanner(id, token);
      setBanners(banners.filter((b) => b.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການລົບ banner"
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ຈັດການ Banner</h1>
          <p className="mt-2 text-muted-foreground">ຮູບພາບເບເນີ banner ທັງໝົດ</p>
        </div>
        <Link href="/admin/banners/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            ສ້າງ Banner ໃໝ່
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">ກຳລັງໂຫລດ...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          ບໍ່ມີ banner
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={`/admin/banners/${banner.id}/edit`}
              className="overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow block"
            >
              {/* Banner Image */}
              <div className="relative h-40 bg-muted overflow-hidden">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      ປິດ
                    </span>
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="p-4">
                <h3 className="font-semibold truncate">{banner.title}</h3>
                {banner.linkUrl && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {banner.linkUrl}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  {banner.isActive ? (
                    <>
                      <Eye className="size-3" />
                      <span>ເປີດ</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3" />
                      <span>ປິດ</span>
                    </>
                  )}
                  <span className="ml-auto">ລຳດັບ: {banner.order}</span>
                </div>

                {/* Delete Button */}
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(banner.id);
                    }}
                    className="w-full gap-2"
                  >
                    <Trash2 className="size-4" />
                    ລົບ
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
