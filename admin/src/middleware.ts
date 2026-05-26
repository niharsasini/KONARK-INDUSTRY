import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_auth");
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin-login";
  const isPublicAsset = pathname.startsWith("/_next") || pathname.startsWith("/favicon");

  if (isPublicAsset) return NextResponse.next();

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
