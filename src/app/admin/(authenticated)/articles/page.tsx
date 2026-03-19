import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  news: 'News',
  education: 'Education',
  community: 'Community',
  certification: 'Certification',
  general: 'General',
};

export default async function AdminArticlesPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/admin/articles/new">
          <Button className="bg-ada-purple hover:bg-ada-purple/90">
            + New Article
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Category</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Published</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((article) => (
              <tr key={article.id} className="border-b hover:bg-zinc-50">
                <td className="p-3 font-medium">{article.title}</td>
                <td className="p-3">
                  {CATEGORY_LABELS[article.category] ?? article.category}
                </td>
                <td className="p-3">
                  <Badge
                    className={STATUS_COLORS[article.status] ?? ''}
                    variant="secondary"
                  >
                    {article.status}
                  </Badge>
                </td>
                <td className="p-3 text-gray-500">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString()
                    : '—'}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="text-ada-purple hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No articles yet. Create your first article!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
