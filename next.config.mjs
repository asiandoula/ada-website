/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-lib'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      // Old become-a-doula paths → new certifications structure
      {
        source: '/become-a-doula/steps-to-certification',
        destination: '/certifications/postpartum-doula/steps',
        permanent: true,
      },
      {
        source: '/become-a-doula/license-and-exam',
        destination: '/certifications/postpartum-doula/exam',
        permanent: true,
      },
      {
        source: '/become-a-doula/renew-recertification',
        destination: '/for-doulas/renew',
        permanent: true,
      },
      {
        source: '/become-a-doula/find-a-doula-training',
        destination: '/certifications/postpartum-doula/training',
        permanent: true,
      },
      {
        source: '/become-a-doula/doula-verification',
        destination: '/verify',
        permanent: true,
      },
      {
        source: '/become-a-doula/code-of-conduct',
        destination: '/for-doulas/code-of-conduct',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
