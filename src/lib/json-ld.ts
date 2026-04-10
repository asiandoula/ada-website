const BASE_URL = 'https://asiandoula.org';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Asian Doula Alliance',
    url: BASE_URL,
    logo: `${BASE_URL}/ada-logo.svg`,
    description:
      'Setting standards in postpartum care through culturally integrated training and certification.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '7515 Irvine Center Dr, #110',
      addressLocality: 'Irvine',
      addressRegion: 'CA',
      postalCode: '92618',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-714-202-6501',
      email: 'contact@asiandoula.org',
      contactType: 'customer service',
    },
    sameAs: ['https://www.instagram.com/asian_doula'],
  };
}

export function articleJsonLd(article: {
  title: string;
  excerpt?: string | null;
  author?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.cover_image || undefined,
    author: {
      '@type': 'Organization',
      name: article.author || 'Asian Doula Alliance',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Asian Doula Alliance',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/ada-logo.svg` },
    },
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function courseJsonLd(course: {
  name: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Asian Doula Alliance',
      url: BASE_URL,
    },
    educationalLevel: 'Professional',
  };
}

export function breadcrumbJsonLd(
  segments: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((seg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: seg.name,
      item: `${BASE_URL}${seg.path}`,
    })),
  };
}
