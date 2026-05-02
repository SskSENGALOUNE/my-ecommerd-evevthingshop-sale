import { apiClient } from "./client";

export interface AdminLoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    admin: {
      id: string;
      email: string;
      name: string;
      role: "SUPER_ADMIN" | "ADMIN";
    };
  };
}

export interface CustomerLoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    customer: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface CustomerRegisterResponse {
  success: boolean;
  data: {
    accessToken: string;
    customer: {
      id: string;
      email: string;
      name: string;
    };
  };
}

/**
 * Admin Login
 * @param email - Admin email
 * @param password - Admin password
 * @returns Admin user data + accessToken
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  return apiClient<AdminLoginResponse>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Customer Login
 * @param email - Customer email
 * @param password - Customer password
 * @returns Customer user data + accessToken
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<CustomerLoginResponse> {
  return apiClient<CustomerLoginResponse>("/auth/customer/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Customer Register
 * @param email - Customer email
 * @param password - Customer password
 * @param name - Customer name
 * @param phone - Customer phone (optional)
 * @returns Customer user data + accessToken
 */
export async function registerCustomer(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<CustomerRegisterResponse> {
  return apiClient<CustomerRegisterResponse>("/auth/customer/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name, phone }),
  });
}

/**
 * ເກັບ admin token ຈາກ localStorage
 */
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

/**
 * ເກັບ customer token ຈາກ localStorage
 */
export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("customerToken");
}

/**
 * ລົບ admin token ຈາກ localStorage
 */
export function removeAdminToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  }
}

/**
 * ລົບ customer token ຈາກ localStorage
 */
export function removeCustomerToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerData");
  }
}

/**
 * Admin Logout - ລົບ localStorage data ແລະ cookies
 * Token ໂດຍປົກກະຕິຖືກຈັດການໂດຍ browser (httpOnly)
 */
export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    // ລົບ user data ຈາກ localStorage
    localStorage.removeItem("adminData");

    // ລົບ admin_token cookie
    document.cookie = "admin_token=; path=/; max-age=0";
  }
}

/**
 * Customer Logout - ລົບ localStorage data ແລະ cookies
 * Token ໂດຍປົກກະຕິຖືກຈັດການໂດຍ browser (httpOnly)
 */
export function logoutCustomer(): void {
  if (typeof window !== "undefined") {
    // ລົບ user data ຈາກ localStorage
    localStorage.removeItem("customerData");

    // ລົບ customer_token cookie
    document.cookie = "customer_token=; path=/; max-age=0";
  }
}
