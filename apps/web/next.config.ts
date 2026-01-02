import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['style-loader', 'css-loader'],
        },
      },
    },
  },
};

export default nextConfig;
