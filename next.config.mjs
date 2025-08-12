/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Adiciona a regra para tratar o módulo do ChromaDB como externo
    // Isso evita que o Webpack tente fazer o download do arquivo durante o build.
    config.externals = [...config.externals, {
      '@chroma-core/default-embed': 'commonjs @chroma-core/default-embed',
    }];

    return config;
  },
};

export default nextConfig;