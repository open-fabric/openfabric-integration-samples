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
      {
        source: "/html",
        destination: "/index.html",
        permanent: false,
      },
      {
        source: "/html/success",
        destination: "/success.html",
        permanent: false,
      },
      {
        source: "/html/failed",
        destination: "/failed.html",
        permanent: false,
      },
    ];
  }
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
