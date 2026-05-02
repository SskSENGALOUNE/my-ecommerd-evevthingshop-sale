"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAdmin = useAuthStore((state) => state.setAdmin);

  const handleAdminLoginSuccess = (data: any) => {
    const adminData = data.admin;
    setAdmin(adminData, data.token);
    localStorage.setItem("adminData", JSON.stringify(adminData));
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">ເຂົ້າສູ່ລະບົບ</h1>
            <p className="text-sm text-muted-foreground">
              ເຂົ້າສູ່ລະບົບຜູ້ຄຸ້ມຄອງ
            </p>
          </div>

          <AdminLoginForm onSuccess={handleAdminLoginSuccess} />
        </div>
      </div>
    </div>
  );
}
