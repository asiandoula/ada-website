import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://asiandoula.org';

  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about-us/history', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about-us/mission-value', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about-us/board', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/about-us/board/election', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/certifications', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/certifications/postpartum-doula', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/certifications/postpartum-doula/steps', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/certifications/postpartum-doula/training', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/certifications/postpartum-doula/exam', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/certifications/birth-doula', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/certifications/ibclc', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/for-families', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/for-families/how-we-train', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/for-families/find-a-doula', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/for-doulas/renew', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/for-doulas/code-of-conduct', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/programs', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/programs/scholarship', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/support', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/support/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/support/contact', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/articles', priority: 0.7, changeFrequency: 'weekly' as const },
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Dynamic article pages
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
