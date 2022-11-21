/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/demo/sdk-card",
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/sdk-card",
        destination: "/sdk-card.html",
      },
      {
        source: "/sdk-card-success",
        destination: "/sdk-card-success.html",
      },
      {
        source: "/sdk-card-failed",
        destination: "/sdk-card-failed.html",
      }
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
