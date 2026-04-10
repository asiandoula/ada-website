import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Asian Doula Alliance',
    short_name: 'ADA',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    theme_color: '#606090',
    background_color: '#FFFAF5',
    display: 'browser',
  };
}
