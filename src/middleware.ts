import { i18nRouter } from "next-i18n-router";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouterConfig } from "@/i18n/config";
import { isAppLocale, LOCALE_COOKIE } from "@/i18n/config";

const isProd = process.env.NODE_ENV === "production";

function cspValue(allowEmbedding: boolean) {
  const scriptSrc = isProd
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  const extras = isProd ? "upgrade-insecure-requests; " : "";
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    allowEmbedding ? "frame-ancestors *" : "frame-ancestors 'none'",
    "form-action 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https: ws: wss:",
    "frame-src 'self' https:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    extras.trim(),
  ]
    .filter(Boolean)
    .join("; ");
}

function applySecurityHeaders(response: NextResponse, allowEmbedding: boolean) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  if (allowEmbedding) {
    response.headers.delete("X-Frame-Options");
    // Prevent duplicate embed URL query variants (?embed=1) from indexing or competing with canonical pages
    response.headers.set("X-Robots-Tag", "noindex, follow");
  } else {
    response.headers.set("X-Frame-Options", "DENY");
  }
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(self), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  response.headers.set("Content-Security-Policy", cspValue(allowEmbedding));
  if (isProd) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
}

function hostAllowed(hostHeader: string | null): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.split(":")[0].trim().toLowerCase();
  const configured = process.env.ALLOWED_HOSTS?.split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  if (configured && configured.length > 0) {
    if (configured.includes(host)) return true;
    if (configured.some((c) => c.startsWith("*.") && host.endsWith(c.slice(1)))) return true;
  }
  // Safe defaults for local dev, production, and Vercel staging preview branches
  return (
    ["localhost", "127.0.0.1", "utilityclock.com", "www.utilityclock.com"].includes(host) ||
    host.endsWith(".vercel.app")
  );
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host");
  if (!hostAllowed(hostHeader)) {
    return new NextResponse("Invalid host", { status: 400 });
  }

  // Enforce standardized preferred hostname: 301 redirect non-www utilityclock.com -> www.utilityclock.com
  const hostOnly = hostHeader?.split(":")[0].trim().toLowerCase();
  if (hostOnly === "utilityclock.com") {
    const url = request.nextUrl.clone();
    url.host = "www.utilityclock.com";
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Direct root legacy redirects to canonical localized calendar hub routes
  if (first === "hindu-calendar") {
    const url = request.nextUrl.clone();
    url.pathname = `/en/calendar/hindu-calendar`;
    return NextResponse.redirect(url, 301);
  }
  if (first === "gujarati-calendar") {
    const url = request.nextUrl.clone();
    url.pathname = `/en/calendar/gujarati-calendar`;
    return NextResponse.redirect(url, 301);
  }

  if (first && isAppLocale(first)) {
    if (segments[1] === "hindu-calendar") {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/calendar/hindu-calendar`;
      return NextResponse.redirect(url, 301);
    }
    if (segments[1] === "gujarati-calendar") {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/calendar/gujarati-calendar`;
      return NextResponse.redirect(url, 301);
    }
  }

  const allowEmbedding = request.nextUrl.searchParams.get("embed") === "1";
  const requestHeaders = new Headers(request.headers);
  if (first && isAppLocale(first)) {
    requestHeaders.set("x-next-i18n-router-locale", first);
  }
  const response =
    first && isAppLocale(first)
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : i18nRouter(request, i18nRouterConfig);
  if (first && isAppLocale(first)) {
    response.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      secure: isProd,
    });
  }
  applySecurityHeaders(response, allowEmbedding);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|site.webmanifest|manifest.webmanifest|.*\\.(?:svg|ico|png|jpg|jpeg|gif|webp|json|xml|txt|webmanifest|js)$).*)",
  ],
};
