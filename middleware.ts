import { NextResponse, type NextRequest } from "next/server";
import { subdomainFromHost } from "@/lib/sites/host";

const ADMIN_COOKIE = "psw_admin";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";
  const { pathname, searchParams } = request.nextUrl;

  // Gate /admin (and any nested route) behind ADMIN_ACCESS_TOKEN.
  // Auth model: cookie `psw_admin` must match env ADMIN_ACCESS_TOKEN.
  // Login: visit /admin?token=<ADMIN_ACCESS_TOKEN> once to set the cookie, then it persists.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const expected = process.env.ADMIN_ACCESS_TOKEN;
    if (!expected) {
      // No token configured → admin is unreachable in production. Fail closed.
      return new NextResponse("Admin disabled. Set ADMIN_ACCESS_TOKEN.", { status: 404 });
    }
    const queryToken = searchParams.get("token");
    const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value ?? "";

    if (queryToken && timingSafeEqual(queryToken, expected)) {
      const clean = request.nextUrl.clone();
      clean.searchParams.delete("token");
      const res = NextResponse.redirect(clean);
      res.cookies.set(ADMIN_COOKIE, expected, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 hours
      });
      return res;
    }

    if (!timingSafeEqual(cookieToken, expected)) {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  const slug = subdomainFromHost(host);
  if (
    slug &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    pathname !== "/favicon.ico"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/sites/${slug}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|og-default.png).*)"],
};
