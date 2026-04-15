/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse contiene código de debug en su index que rompe el build de Next.
  // Importamos el subpath interno en lib/extractors/pdf.ts, pero aún así
  // lo externalizamos para que el bundler del servidor no lo procese.
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
