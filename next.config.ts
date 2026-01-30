import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://15.165.159.68:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
