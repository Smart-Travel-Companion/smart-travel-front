import { NextResponse } from "next/server";

export function middleware() {
  // JWT is stored in localStorage (client-side only)
  // Route protection is handled by the AuthGuard component on the client
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
