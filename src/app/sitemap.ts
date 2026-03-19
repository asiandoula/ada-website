import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://asiandoula.org';

  const staticPages = [
    '',
    '/about-us',
    '/about-us/history',
    '/about-us/mission-value',
    '/become-a-doula/steps-to-certification',
    '/become-a-doula/license-and-exam',
    '/become-a-doula/renew-recertification',
    '/become-a-doula/find-a-doula-training',
    '/become-a-doula/code-of-conduct',
    '/articles',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  const articlePages = (articles || []).map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages];
}
