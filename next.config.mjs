/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
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
