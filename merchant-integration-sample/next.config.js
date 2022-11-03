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
        source: "/index",
        destination: "/index.html",
      },
      {
        source: "/orchestrated/vanilla",
        destination: "/vanilla.html",
      },
      {
        source: "/orchestrated/dynamic-schema",
        destination: "/dynamic-schema.html",
      },
      {
        source: "/embedded/checkout",
        destination: "/embedded/checkout-form/index.html",
      },
      {
        source: "/embedded/checkout/:path*",
        destination: "/embedded/checkout-form/:path*",
      },
      {
        source: "/embedded/checkout-success",
        destination: "/embedded/checkout-success/index.html",
      },
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
