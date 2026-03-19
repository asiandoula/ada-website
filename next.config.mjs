/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/become-a-doula/doula-verification',
        destination: '/verify',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
