/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  assetPrefix: "/merchant-pat-link/",
  basePath: '/merchant-pat-link',

  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/merchant-pat-link",
        basePath: false,
        permanent: false,
      },
    ];
  },
};
module.exports = nextConfig;
