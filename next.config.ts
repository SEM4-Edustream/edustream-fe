import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'link-anh-bia-demo.com' },
      { protocol: 'https', hostname: 'edustream-video-storage-216261470374-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.ap-southeast-2.amazonaws.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' }
    ],
  },
};

export default nextConfig;
