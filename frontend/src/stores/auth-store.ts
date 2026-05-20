import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface Admin {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

interface AuthState {
  user: User | null;
  admin: Admin | null;
  customerToken: string | null;
  adminToken: string | null;
  setUser: (user: User | null, token: string | null) => void;
  setAdmin: (admin: Admin | null, token: string | null) => void;
  logout: () => void;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      admin: null,
      customerToken: null,
      adminToken: null,
      setUser: (user, token) => set({ user, customerToken: token }),
      setAdmin: (admin, token) => set({ admin, adminToken: token }),
      logout: () => set({ user: null, customerToken: null }),
      adminLogout: () => set({ admin: null, adminToken: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        customerToken: state.customerToken,
        admin: state.admin,
        adminToken: state.adminToken,
      }),
    }
  )
);

// รอ Zustand hydrate จาก localStorage ก่อน ป้องกัน redirect ผิดพลาด
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
