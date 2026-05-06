"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { BannerForm } from "@/components/admin/banner-form";
import { getAdminToken } from "@/lib/api/auth";
import { getBannerById, Banner } from "@/lib/api/banner";

export default function EditBannerPage() {
  const params = useParams();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanner = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      if (!token) {
        setError("ກະລຸນາ login ກ່ອນ");
        return;
      }
      const response = await getBannerById(params.id as string, token);
      setBanner(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການໂຫລດ banner"
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadBanner();
  }, [loadBanner]);

  if (loading) {
    return <div className="text-center py-8">ກຳລັງໂຫລດ...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="rounded-lg bg-muted p-4 text-muted-foreground">
        ບໍ່ພົບ banner
      </div>
    );
  }

  return <BannerForm banner={banner} mode="edit" />;
}
