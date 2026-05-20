"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { loginAdmin } from "@/lib/api/auth";

const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "ກະລຸນາປ້ອນ Email")
    .email("Email ບໍ່ຖືກຕ້ອງ"),
  password: z.string().min(6, "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

interface AdminLoginFormProps {
  onSuccess?: (data: any) => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const PRESET_ACCOUNTS = [
    { label: "Super Admin", email: "superadmin@shop.com", password: "SuperAdmin@1234", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { label: "Admin", email: "admin@shop.com", password: "Admin@1234", color: "bg-blue-100 text-blue-700 border-blue-200" },
  ];

  const handleQuickLogin = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAdmin(data.email, data.password);

      if (result.success && result.data) {
        onSuccess?.({
          token: result.data.accessToken,
          admin: result.data.admin,
        });
      } else {
        throw new Error("ເຂົ້າສູ່ລະບົບຜິດພາດ");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Login */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Quick Login</p>
        <div className="flex gap-2">
          {PRESET_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => handleQuickLogin(account.email, account.password)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:opacity-80 ${account.color}`}
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-background px-2">ຫຼື ກອກດ້ວຍຕົນເອງ</span>
        </div>
      </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          ອີເມວ
        </label>
        <input
          id="email"
          type="email"
          placeholder="admin@shop.com"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          ລະຫັດຜ່ານ
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          {...register("password")}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 px-4 py-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "ກຳລັງເຂົ້າສູ່ລະບົບ..." : "ເຂົ້າສູ່ລະບົບ"}
      </Button>
    </form>
    </div>
  );
}
