/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-email/components", "react-hook-form"],
  },
};

module.exports = nextConfig;
