import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/entrar" || request.cookies.has("nexora_admin")) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/entrar", request.url));
}

export const config = { matcher: "/admin/:path*" };
