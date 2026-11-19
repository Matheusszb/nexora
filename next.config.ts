import type { NextConfig } from "next";

const storageHostname = (() => {
  try {
    const url = new URL(process.env.SUPABASE_URL || "");
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co") ? url.hostname : null;
  } catch { return null; }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: storageHostname ? [{
      protocol: "https",
      hostname: storageHostname,
      pathname: "/storage/v1/object/public/product-images/**"
    }] : []
  },
  headers: async () => [{
    source: "/:path*",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ]
  }]
};

export default nextConfig;
