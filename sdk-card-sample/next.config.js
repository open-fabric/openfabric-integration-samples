/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/sdk-card/",
  basePath: '/sdk-card',
  experimental: {
    outputStandalone: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/sdk-card",
        basePath: false,
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/html",
        destination: "/sdk-card/index.html",
      },
      {
        source: "/html/success",
        destination: "/sdk-card/success.html",
      },
      {
        source: "/html/failed",
        destination: "/sdk-card/failed.html",
      },
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
