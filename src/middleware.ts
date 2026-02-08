import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // JWT is stored in localStorage (client-side only)
  // Route protection is handled by the AuthGuard component on the client
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
