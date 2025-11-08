import { NextResponse, type ProxyConfig, type NextRequest } from "next/server";

import * as roles from "@merch/config/permission/whitelisted-page";
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@merch/auth";

type Session = typeof auth.$Infer.Session;

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip session check for static paths and API routes
  if (
    path.startsWith("/api/") ||
    path.startsWith("/_next/") ||
    path.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    },
  );

  // redirect authenticated users away from login page
  if (session?.user && path === "/login") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  // handle root path based on authentication status
  // unauthenticated users: rewrite to home
  if (path === "/" && !session?.user) {
    return NextResponse.rewrite(new URL("/home", request.nextUrl.origin));
  }

  // for unauthenticated users, check whitelist
  if (!session?.user) {
    const patterns: string[] = roles.guest;

    const matches =
      patterns.length > 0 &&
      patterns.some((pat) => {
        try {
          const re = globToRegex(pat);
          return re.test(path);
        } catch {
          return false;
        }
      });

    if (!matches) {
      return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|static/).*)",
  ],
};

const globToRegex = (glob: string) => {
  // escape regex metacharacters, then restore glob wildcards
  const escaped = glob.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
  const regexStr =
    "^" +
    escaped
      .replace(/\\\*\\\*/g, ".*") // ** -> .*
      .replace(/\\\*/g, "[^/]*") + // * -> no slash
    "$";
  return new RegExp(regexStr);
};
