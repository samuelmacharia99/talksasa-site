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
        source: "/:path*",
        has: [{ type: "host", value: "www.talksasa.com" }],
        destination: "https://talksasa.com/:path*",
        permanent: true,
      },
      {
        source: "/application-hosting",
        destination: "/cloud-hosting",
        permanent: true,
      },
      {
        source: "/web-hosting",
        destination: "/email-hosting",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
