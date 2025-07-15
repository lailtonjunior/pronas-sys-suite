/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Adicione este bloco para resolver o erro do ChromaDB
  webpack: (config) => {
    config.externals = [...config.externals, {
      '@chroma-core/default-embed': 'commonjs @chroma-core/default-embed',
    }];

    return config;
  },
};

export default nextConfig;