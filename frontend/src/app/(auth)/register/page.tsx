import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ສະໝັກສະມາຊິກ",
};

export default function RegisterPage() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-center">ສະໝັກສະມາຊິກ</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        ສ້າງບັນຊີໃໝ່ເພື່ອເລີ່ມຊື້ສິນຄ້າ
      </p>
    </div>
  );
}
