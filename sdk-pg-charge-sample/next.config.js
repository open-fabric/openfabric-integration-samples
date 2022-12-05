/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/sdk-pg-charge/",
  basePath: '/sdk-pg-charge',
  experimental: {
    outputStandalone: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/sdk-pg-charge",
        basePath: false,
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/html",
        destination: "/sdk-pg-charge/index.html",
      },
      {
        source: "/html/success",
        destination: "/sdk-pg-charge/success.html",
      },
      {
        source: "/html/failed",
        destination: "/sdk-pg-charge/failed.html",
      },
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
