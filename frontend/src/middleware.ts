import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CUSTOMER_PROTECTED = ["/cart", "/checkout", "/orders", "/account"];
const ADMIN_PROTECTED = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — check admin token
  if (pathname.startsWith(ADMIN_PROTECTED)) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Customer protected routes — check customer token
  const isCustomerProtected = CUSTOMER_PROTECTED.some((route) =>
    pathname.startsWith(route)
  );
  if (isCustomerProtected) {
    const customerToken = request.cookies.get("auth_token")?.value;
    if (!customerToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/checkout/:path*", "/orders/:path*", "/account/:path*"],
};
