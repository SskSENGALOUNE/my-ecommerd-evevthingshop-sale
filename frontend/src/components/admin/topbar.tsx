"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

interface TopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: TopbarProps) {
  const admin = useAuthStore((s) => s.admin);
  const adminLogout = useAuthStore((s) => s.adminLogout);
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {admin?.name || "Admin"}
        </span>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="size-5" />
          <span className="sr-only">ອອກຈາກລະບົບ</span>
        </Button>
      </div>
    </header>
  );
}
