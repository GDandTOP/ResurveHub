import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gwnxsgispnuvkyayszlu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Supabase 이미지 최적화를 위한 설정
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 개발 환경에서 이미지 최적화를 비활성화 (옵션)
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
