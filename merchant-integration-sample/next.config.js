/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [{
      source: '/',
      destination: '/Orchestrated',
      permanent: true
    }]
  },
  rewrites: async () => {
    return [
      {
        source: "/Orchestrated/vanilla",
        destination: "/vanilla.html",
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
const withTM = require("next-transpile-modules")([
  "@open-fabric/slice-merchant-sdk",
]);
module.exports = withTM(nextConfig);
