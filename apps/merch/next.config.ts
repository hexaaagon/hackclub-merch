import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // needed because slack oauth does not support http urls
  // allowedDevOrigins: ["https://supreme-kodiak-stable.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
