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
        destination: "/checkout-form/index.html",
      },
      {
        source: "/embedded/checkout/:path*",
        destination: "/checkout-form/:path*",
      },
    ];
  },
};
const withTM = require("next-transpile-modules")(["@openfabric/merchant-sdk"]);
module.exports = withTM(nextConfig);
