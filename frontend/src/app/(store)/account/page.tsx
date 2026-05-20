"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, MapPin, LogOut, ChevronRight, User } from "lucide-react";
import { useAuthStore, useHasHydrated } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useHasHydrated();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    document.cookie = "customer_token=; path=/; max-age=0";
    router.replace("/");
  };

  // รอ hydrate ก่อน ป้องกัน redirect ผิดตอน refresh
  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">ກຳລັງໂຫລດ...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  const menuItems = [
    {
      icon: ShoppingBag,
      label: "ຄຳສັ່ງຊື້ຂອງຂ້ອຍ",
      sublabel: "ກວດສອບສະຖານະການສັ່ງຊື້",
      href: "/orders",
    },
    {
      icon: MapPin,
      label: "ທີ່ຢູ່ຈັດສົ່ງ",
      sublabel: "ຈັດການທີ່ຢູ່ຂອງທ່ານ",
      href: "/account/addresses",
    },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
      {/* Avatar + ข้อมูล */}
      <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={72}
            height={72}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex size-[72px] items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {initial}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            <svg className="size-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </span>
        </div>

        <Link
          href="/account/edit"
          className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <User className="size-5" />
        </Link>
      </div>

      {/* Menu items */}
      <div className="rounded-xl border bg-card divide-y overflow-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-accent transition-colors"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <item.icon className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sublabel}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="size-4" />
        ອອກຈາກລະບົບ
      </button>
    </div>
  );
}
