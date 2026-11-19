import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the reset token (in the URL on first load) out of Referer headers.
  async headers() {
    return [
      {
        source: "/reset-password",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
