/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // pdf.js (résumé viewer) optionally requires Node's `canvas` for server rendering — not used in the browser.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
