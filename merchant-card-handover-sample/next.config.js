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
        destination: "/orchestrated",
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/vanilla",
        destination: "/vanilla.html",
      },
      {
        source: "/card-handover-success",
        destination: "/card-handover-success.html",
      }
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
