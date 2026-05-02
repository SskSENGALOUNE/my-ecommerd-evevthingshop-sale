import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CUSTOMER_PROTECTED = ["/cart", "/checkout", "/orders", "/account"];
const ADMIN_PROTECTED = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ====== ADMIN ROUTES ======
  if (pathname.startsWith(ADMIN_PROTECTED)) {
    // ไม่ดัก /admin/login
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ====== CUSTOMER PROTECTED ROUTES ======
  const isCustomerProtected = CUSTOMER_PROTECTED.some((route) =>
    pathname.startsWith(route)
  );

  if (isCustomerProtected) {
    const customerToken = request.cookies.get("customer_token")?.value;

    if (!customerToken) {
      // ไม่มี token → ส่งไป login page (customer role)
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // มี token → ให้ผ่าน
    return NextResponse.next();
  }

  // ====== PUBLIC ROUTES ======
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/account/:path*",
  ],
};
