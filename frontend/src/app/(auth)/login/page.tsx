"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { loginCustomer } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const PRESET_ACCOUNTS = [
    { label: "Test Customer", email: "customer@shop.com", password: "Customer@1234" },
  ];

  const redirect = searchParams.get("redirect") || "/";

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginCustomer(email, password);
      setUser(result.data.customer, result.data.accessToken);
      document.cookie = `customer_token=${result.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
      router.replace(redirect);
    } catch (err: any) {
      setError(err?.message || "ອີເມລ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-900 p-12 text-white">
        <div className="text-xl font-bold tracking-tight">Everything Shop</div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            ສິນຄ້າຄຸນນະພາບ<br />ສົ່ງຮອດໃຈ
          </h1>
          <p className="text-zinc-400 text-lg">
            ເຂົ້າສູ່ລະບົບເພື່ອສໍາຮອງ, ຕິດຕາມຄໍາສັ່ງຊື້ ແລະ ຈັດການບັນຊີ
          </p>
        </div>
        <p className="text-sm text-zinc-500">© 2026 Everything Shop. ສະຫງວນລິຂະສິດ.</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden text-center">
            <span className="text-2xl font-bold">Everything Shop</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">ເຂົ້າສູ່ລະບົບ</h2>
            <p className="text-muted-foreground text-sm">ຍິນດີຕ້ອນຮັບກັບຄືນ</p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold shadow-sm hover:bg-accent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
              </svg>
            ) : (
              <svg className="size-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            ດຳເນີນການຕໍ່ດ້ວຍ Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-3">ຫຼື ເຂົ້າສູ່ລະບົບດ້ວຍອີເມລ</span>
            </div>
          </div>

          {/* Quick Login */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Quick Login</p>
            <div className="flex gap-2">
              {PRESET_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => { setEmail(account.email); setPassword(account.password); }}
                  className="flex-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">ອີເມລ</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">ລະຫັດຜ່ານ</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "ກຳລັງເຂົ້າສູ່ລະບົບ..." : "ເຂົ້າສູ່ລະບົບ"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ຍັງບໍ່ມີບັນຊີ?{" "}
            <Link href="/register" className="font-semibold text-foreground hover:underline">
              ສ້າງບັນຊີໃໝ່
            </Link>
          </p>

          <div className="text-center">
            <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ເຂົ້າສູ່ລະບົບສຳລັບຜູ້ຄຸ້ມຄອງ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">ກຳລັງໂຫລດ...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
