"use client";

import { useAuthStore } from "@/stores/auth-store";

export default function AdminDashboardPage() {
  const admin = useAuthStore((s) => s.admin);
  const adminToken = useAuthStore((s) => s.adminToken);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">ພາບລວມຍອດຂາຍ</p>
      </div>

      {admin && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">ຂໍ້ມູນຜູ້ຄຸ້ມຄອງ</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">ຊື່:</span> {admin.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {admin.email}
            </p>
            <p>
              <span className="font-medium">ບົດບາດ:</span> {admin.role}
            </p>
            {adminToken && (
              <p className="text-xs text-muted-foreground truncate">
                <span className="font-medium">Token:</span> {adminToken.slice(0, 20)}...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">ຍອດຂາຍວັນນີ້</p>
          <p className="text-2xl font-bold mt-2">0₭</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">ຄໍາສັ່ງວັນນີ້</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">ລູກຄ້າໃໝ່</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
