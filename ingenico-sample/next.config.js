/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/ingenico-pos/",
  basePath: '/ingenico-pos',
  experimental: {
    outputStandalone: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/ingenico-pos",
        basePath: false,
        permanent: false,
      },
    ];
  },
};
module.exports = nextConfig;
