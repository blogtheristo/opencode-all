/**
 * Next.js Configuration for OneLifetime.World
 * Optimized for Cloudflare Pages deployment
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages
  output: "export",

  // Image optimization must be disabled for static export
  images: {
    unoptimized: true,
  },

  // Usually NOT needed on Cloudflare Pages unless you truly use a separate CDN origin.
  // Keeping empty avoids accidental absolute asset URLs.
  assetPrefix: "",

  // Consistent routing (Cloudflare Pages is fine with trailing slashes)
  trailingSlash: true,

  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // NOTE: headers() does not apply with output: "export"
  // Move headers to Cloudflare Pages via `public/_headers`.

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },

  env: {
    SITE_URL: "https://onelifetime.world",
    SITE_NAME: "OneLifetime.World",
    SITE_DESCRIPTION: "Move faster from legacy operations to intelligent decisioning.",
  },
};

module.exports = nextConfig;
