"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { loginCustomerWithGoogle } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase ส่ง error params มาตรง URL
      const urlError = searchParams.get("error");
      if (urlError) {
        const desc = searchParams.get("error_description") || urlError;
        console.error("Supabase OAuth error:", desc);
        router.replace("/login?error=google_failed");
        return;
      }

      // PKCE flow: Supabase v2 ส่ง ?code= มาใน URL แลก session
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("exchangeCodeForSession error:", error.message);
          router.replace("/login?error=google_failed");
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace("/login?error=google_failed");
        return;
      }

      try {
        const result = await loginCustomerWithGoogle(data.session.access_token);
        const avatarUrl = data.session.user.user_metadata?.avatar_url as string | undefined;
        setUser({ ...result.data.customer, avatarUrl }, result.data.accessToken);

        // set cookie บน frontend domain เพื่อให้ middleware อ่านได้
        document.cookie = `customer_token=${result.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;

        const redirect = searchParams.get("redirect") || "/";
        router.replace(redirect);
      } catch {
        router.replace("/login?error=google_failed");
      }
    };

    handleCallback();
  }, [router, searchParams, setUser]);

  return <p className="text-muted-foreground">ກຳລັງເຂົ້າສູ່ລະບົບ...</p>;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p className="text-muted-foreground">ກຳລັງໂຫລດ...</p>}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
