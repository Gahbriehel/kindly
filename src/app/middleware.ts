// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/features",
  "/pricing",
  "/about",
  "/auth/login",
  "/auth/signup",
  // add any other public marketing or legal pages
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, api routes, _next, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    /\.\w+$/.test(pathname) // images, fonts, etc.
  ) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/auth/");

  // Option A: Simple session check (cookies, JWT, etc.)
  const sessionToken = request.cookies.get("your-session-cookie")?.value;

  if (!isPublicPath && !sessionToken) {
    // Redirect to login, preserve intended path
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: logged-in users hitting / → go to dashboard
  if (sessionToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};