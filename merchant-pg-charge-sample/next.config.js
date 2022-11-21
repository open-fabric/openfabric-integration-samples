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
        destination: "/demo/sdk-pg-charge",
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/sdk-pg-charge",
        destination: "/sdk-pg-charge.html",
      },
      {
        source: "/sdk-pg-charge-success",
        destination: "/sdk-pg-charge-success.html",
      }
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
