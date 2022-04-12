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
        destination: "/orchestrated/fill-sample",
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/orchestrated/vanilla",
        destination: "/vanilla.html",
      },
      {
        source: "/orchestrated/vanilla-custom-button",
        destination: "/vanilla-custom-button.html",
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
