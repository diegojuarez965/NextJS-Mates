// Configuración de PWA con Next.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // PWA desactivado en desarrollo
  buildExcludes: [/app-build-manifest\.json$/], // Excluir archivos innecesarios del manifest
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Permitir imágenes desde Cloudinary
        pathname: '/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);