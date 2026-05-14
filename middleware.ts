import { NextResponse, type NextRequest } from "next/server";
import { subdomainFromHost } from "@/lib/sites/host";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";
  const { pathname } = request.nextUrl;

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
