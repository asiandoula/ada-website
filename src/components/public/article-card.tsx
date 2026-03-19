import Link from 'next/link';
import Image from 'next/image';

const CATEGORY_COLORS: Record<string, string> = {
  news: 'bg-blue-100 text-blue-800',
  education: 'bg-green-100 text-green-800',
  community: 'bg-purple-100 text-purple-800',
  certification: 'bg-orange-100 text-orange-800',
  general: 'bg-gray-100 text-gray-800',
};

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  published_at: string | null;
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  cover_image,
  category,
  published_at,
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`}>
      <article className="group bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        {/* Cover Image */}
        <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
          {cover_image ? (
            <Image
              src={cover_image}
              alt={title}
              width={640}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-ada-lavender" />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Badge */}
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${
              CATEGORY_COLORS[category] ?? CATEGORY_COLORS.general
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>

          {/* Title */}
          <h3 className="font-dm-serif text-lg text-ada-navy mb-2 line-clamp-2 group-hover:text-ada-purple transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {excerpt}
            </p>
          )}

          {/* Date */}
          {published_at && (
            <p className="text-xs text-gray-400">
              {new Date(published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
