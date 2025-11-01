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
  rewrites: async () => {
    return [
      {
        source: "/shop",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/about",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/search",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/carts",
        destination: "/error-pages/page-unavailable",
      },

      {
        source: "/user",
        destination: "/error-pages/page-unavailable",
      },

      {
        source: "/accessories",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/apparel",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/collections",
        destination: "/error-pages/page-unavailable",
      },
    ];
  },
};

export default nextConfig;
