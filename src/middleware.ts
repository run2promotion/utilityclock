import { i18nRouter } from "next-i18n-router";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouterConfig } from "@/i18n/config";

const isProd = process.env.NODE_ENV === "production";

function cspValue() {
  const scriptSrc = isProd
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  const extras = isProd ? "upgrade-insecure-requests; " : "";
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
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

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  response.headers.set("Content-Security-Policy", cspValue());
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
  if (configured && configured.length > 0) return configured.includes(host);
  // Safe local defaults; in production set ALLOWED_HOSTS explicitly.
  return ["localhost", "127.0.0.1", "utilityclock.com", "www.utilityclock.com"].includes(
    host,
  );
}

export function middleware(request: NextRequest) {
  if (!hostAllowed(request.headers.get("host"))) {
    return new NextResponse("Invalid host", { status: 400 });
  }

  const response = i18nRouter(request, i18nRouterConfig);
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|ico|png|jpg|jpeg|gif|webp|json|xml|txt)$).*)",
  ],
};
