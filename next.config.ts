import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

function readEnvOrigin(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy() {
  const connectSrc = ["'self'"];
  const supabaseOrigin = readEnvOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const apiOrigin = readEnvOrigin(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (supabaseOrigin) {
    connectSrc.push(supabaseOrigin);
  }

  if (apiOrigin && !connectSrc.includes(apiOrigin)) {
    connectSrc.push(apiOrigin);
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSrc.join(" ")}`,
  ].join("; ");
}

const contentSecurityPolicy = buildContentSecurityPolicy();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/account/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Vary",
            value: "Cookie",
          },
        ],
      },
      {
        source: "/logged-in",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Vary",
            value: "Cookie",
          },
        ],
      },
      {
        // Static public HTML routes were being served with ACAO: * in production.
        // Pin these document routes to the first-party origin instead of allowing
        // arbitrary third-party reads.
        source: "/",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://metis.zward.studio",
          },
        ],
      },
      {
        source: "/privacy",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://metis.zward.studio",
          },
        ],
      },
      {
        source: "/terms",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://metis.zward.studio",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
