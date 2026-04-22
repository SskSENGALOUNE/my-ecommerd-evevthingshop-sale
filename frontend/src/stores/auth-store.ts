import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  customerToken: null,
  adminToken: null,
  setUser: (user, token) => set({ user, customerToken: token }),
  setAdmin: (admin, token) => set({ admin, adminToken: token }),
  logout: () => set({ user: null, customerToken: null }),
  adminLogout: () => set({ admin: null, adminToken: null }),
}));
