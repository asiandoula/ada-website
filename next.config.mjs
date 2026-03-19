/** @type {import('next').NextConfig} */
const nextConfig = {
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
