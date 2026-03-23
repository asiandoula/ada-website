import { createClient } from '@supabase/supabase-js';
import DOMPurify from 'isomorphic-dompurify';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard } from '@/components/public/article-card';
import { TableOfContents } from './table-of-contents';
import type { Metadata } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | Asian Doula Alliance`,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) notFound();

  // Fetch related articles (same category, excluding current)
  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('category', article.category)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 py-24 md:py-32">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/articles" className="hover:text-ada-purple">
          Articles
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{article.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
        {/* Main Content */}
        <div>
          {/* Cover Image */}
          {article.cover_image && (
            <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Category Badge */}
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-ada-purple/10 text-ada-purple mb-4">
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>

          {/* Title */}
          <h1 className="font-dm-serif text-3xl sm:text-4xl text-ada-navy mb-4">
            {article.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
            {article.author && <span>By {article.author}</span>}
            {article.published_at && (
              <span>
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-dm-serif prose-headings:text-ada-navy prose-a:text-ada-purple"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
          />
        </div>

        {/* Sidebar: Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents content={article.content} />
          </div>
        </aside>
      </div>

      {/* Related Articles */}
      {related && related.length > 0 && (
        <section className="mt-16 pt-12 border-t">
          <h2 className="font-dm-serif text-2xl text-ada-navy mb-8">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((r) => (
              <ArticleCard
                key={r.id}
                slug={r.slug}
                title={r.title}
                excerpt={r.excerpt}
                cover_image={r.cover_image}
                category={r.category}
                published_at={r.published_at}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
