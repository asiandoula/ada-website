import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ArticleCard } from '@/components/public/article-card';
import { CategoryTabs } from './category-tabs';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Stay informed with the latest news, educational resources, and community stories from the Asian Doula Alliance.',
  openGraph: {
    title: 'Articles | Asian Doula Alliance',
    description:
      'Stay informed with the latest news, educational resources, and community stories from the Asian Doula Alliance.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ALL_CATEGORIES = ['all', 'news', 'education', 'community', 'certification'] as const;

interface SearchParams {
  category?: string;
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory);
  }

  const { data: articles } = await query;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 py-24 md:py-32">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-dm-serif text-4xl text-ada-navy mb-4">
          Articles & News
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed with the latest news, educational resources, and community
          stories from the Asian Doula Alliance.
        </p>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={ALL_CATEGORIES as unknown as string[]}
        activeCategory={activeCategory}
      />

      {/* Article Grid */}
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              cover_image={article.cover_image}
              category={article.category}
              published_at={article.published_at}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}
