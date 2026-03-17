import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
    // Dangerously allow SVG/private IPs to fix next/image resolving ImgBB edge nodes to internal IPs
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
