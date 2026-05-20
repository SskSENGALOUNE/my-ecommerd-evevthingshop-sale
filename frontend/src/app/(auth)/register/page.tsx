"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { registerCustomer } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirect = searchParams.get("redirect") || "/";

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await registerCustomer(email, password, name);
      setUser(result.data.customer, result.data.accessToken);
      document.cookie = `customer_token=${result.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
      router.replace(redirect);
    } catch (err: any) {
      setError(err?.message || "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່");
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
            ເລີ່ມຕົ້ນໄດ້<br />ງ່າຍດາຍ
          </h1>
          <ul className="space-y-3 text-zinc-400">
            {[
              "ສ້າງບັນຊີໃນ 1 ຄລິກດ້ວຍ Google",
              "ຕິດຕາມຄໍາສັ່ງຊື້ຂອງທ່ານໄດ້ທຸກເວລາ",
              "ຈັດການທີ່ຢູ່ຈັດສົ່ງໄດ້ສະດວກ",
            ].map((text) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">✓</span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
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
            <h2 className="text-3xl font-bold tracking-tight">ສ້າງບັນຊີໃໝ່</h2>
            <p className="text-muted-foreground text-sm">ສ້າງບັນຊີເພື່ອເລີ່ມຊື້ສິນຄ້າ</p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
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
            ສ້າງບັນຊີດ້ວຍ Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-3">ຫຼື ສ້າງດ້ວຍອີເມລ</span>
            </div>
          </div>

          {/* Register form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">ຊື່</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ຊື່ຂອງທ່ານ"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
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
              <label className="text-sm font-medium">ລະຫັດຜ່ານ</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "ກຳລັງສ້າງບັນຊີ..." : "ສ້າງບັນຊີ"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ມີບັນຊີຢູ່ແລ້ວ?{" "}
            <Link href="/login" className="font-semibold text-foreground hover:underline">
              ເຂົ້າສູ່ລະບົບ
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            ໂດຍການສ້າງບັນຊີ, ທ່ານຍອມຮັບ{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">ເງື່ອນໄຂ</Link>
            {" "}ແລະ{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">ນະໂຍບາຍ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">ກຳລັງໂຫລດ...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
