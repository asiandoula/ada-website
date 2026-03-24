'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
  { value: 'certification', label: 'Certification' },
];

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  status: string;
  author: string | null;
  published_at: string | null;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('general');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const res = await fetch(`/api/articles/${id}`);
      if (!res.ok) {
        toast.error('Article not found');
        router.push('/admin/articles');
        return;
      }
      const data = await res.json();
      const a = data.article as Article;
      setArticle(a);
      setTitle(a.title);
      setSlug(a.slug);
      setCategory(a.category);
      setExcerpt(a.excerpt || '');
      setAuthor(a.author || '');
      setCoverImage(a.cover_image || '');
      setContent(a.content || '');
      setLoading(false);
    }
    fetchArticle();
  }, [id, router]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/articles/upload-cover', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(`Upload failed: ${data.error}`);
      return;
    }

    setCoverImage(data.url);
    toast.success('Cover image uploaded');
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          cover_image: coverImage,
          category,
          status,
          author,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to save');
        return;
      }

      toast.success(status === 'published' ? 'Article published!' : 'Draft saved!');
      router.push('/admin/articles');
    } catch {
      toast.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete');
        return;
      }
      toast.success('Article deleted');
      router.push('/admin/articles');
    } catch {
      toast.error('Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  const wasPublished = !!article?.published_at;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Slug {wasPublished && <span className="text-gray-400">(read-only, article was published)</span>}
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="article-slug"
            className="font-mono text-sm"
            readOnly={wasPublished}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the article..."
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm resize-none"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="text-sm"
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover preview"
                className="h-20 w-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleSave('draft')}
            variant="outline"
            disabled={saving}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSave('published')}
            className="bg-ada-purple hover:bg-ada-purple/90"
            disabled={saving}
          >
            {article?.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}
