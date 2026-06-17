/** @type {import('next').NextConfig} */
const nextConfig = {
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
