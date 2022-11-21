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
        destination: "/demo/sdk-pg-tokenization",
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/sdk-pg-tokenization",
        destination: "/sdk-pg-tokenization.html",
      },
      {
        source: "/sdk-pg-tokenization-success",
        destination: "/sdk-pg-tokenization-success.html",
      },
      {
        source: "/sdk-pg-tokenization-failed",
        destination: "/sdk-pg-tokenization-failed.html",
      }
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
