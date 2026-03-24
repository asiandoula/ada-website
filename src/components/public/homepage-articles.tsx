import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function HomepageArticles() {
  const supabase = getSupabase();
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, excerpt, cover_image, published_at, category')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/articles/${article.slug}`}
          className="group block bg-ada-off-white rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
        >
          {article.cover_image && (
            <div className="h-[180px] overflow-hidden">
              <Image
                src={article.cover_image}
                alt={article.title}
                width={400}
                height={180}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-6">
            <span className="font-outfit text-xs font-semibold tracking-wider uppercase text-ada-purple">
              {article.category}
            </span>
            <h3 className="mt-2 font-dm-serif text-lg text-ada-navy line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-ada-navy/60 line-clamp-2">
              {article.excerpt}
            </p>
            <p className="mt-3 text-xs text-ada-navy/40 font-outfit">
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
