/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        // Serve the static index.html when the root is requested
        {
          source: '/',
          destination: '/index.html',
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/dev.db',
        destination: '/404',
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
