import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ເຂົ້າສູ່ລະບົບ",
};

export default function LoginPage() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-center">ເຂົ້າສູ່ລະບົບ</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        ເຂົ້າສູ່ລະບົບເພື່ອສັ່ງຊື້ສິນຄ້າ
      </p>
    </div>
  );
}
