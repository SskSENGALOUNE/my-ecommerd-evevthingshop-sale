"use client";

import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">ເຂົ້າສູ່ລະບົບ</h1>
            <p className="text-sm text-muted-foreground">
              ເຂົ້າສູ່ລະບົບເພື່ອສັ່ງຊື້ສິນຄ້າ
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            ສາວະນາ... ລະບົບລູກຄ້າມາໃນໄວໆ
          </div>

          <div className="text-center text-sm">
            <button
              onClick={() => router.push("/admin/login")}
              className="text-primary hover:underline"
            >
              ເຂົ້າສູ່ລະບົບເປັນຜູ້ຄຸ້ມຄອງ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
