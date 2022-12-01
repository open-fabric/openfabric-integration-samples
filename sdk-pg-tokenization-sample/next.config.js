/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/sdk-pg-tokenization",
  basePath: '/sdk-pg-tokenization',
  experimental: {
    outputStandalone: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/sdk-pg-tokenization",
        basePath: false,
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/html",
        destination: "/sdk-pg-tokenization/index.html",
      },
      {
        source: "/html/success",
        destination: "/sdk-pg-tokenization/success.html",
      },
      {
        source: "/html/failed",
        destination: "/sdk-pg-tokenization/failed.html",
      },
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
