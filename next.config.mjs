/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Lower memory use during `next build` on small containers
    cpus: 1,
    webpackBuildWorker: false,
  },
  async redirects() {
    return [
      {
        source: "/application-hosting",
        destination: "/cloud-hosting",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
