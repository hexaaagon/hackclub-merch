import { NextResponse, type ProxyConfig, type NextRequest } from "next/server";

export async function proxy(_request: NextRequest) {
  /* middleware function here */

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|static/).*)",
  ],
};
