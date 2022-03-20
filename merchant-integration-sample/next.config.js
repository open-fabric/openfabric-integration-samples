/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
    {
      source: "/vanilla",
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
  ]},
}
const withTM = require('next-transpile-modules')(["@open-fabric/slice-merchant-sdk"]);
module.exports = withTM(nextConfig)
