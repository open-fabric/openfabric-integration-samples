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
        destination: "/orchestrated/pg-sample",
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/vanilla",
        destination: "/vanilla.html",
      }
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
