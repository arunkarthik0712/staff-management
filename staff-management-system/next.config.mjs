const nextConfig = {
  reactStrictMode: false,
  // compiler: {
  //   removeConsole: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverSourceMaps: true,
  },
  productionBrowserSourceMaps: false,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};
export default nextConfig;
