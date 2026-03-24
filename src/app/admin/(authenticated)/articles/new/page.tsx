'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('general');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

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
      const res = await fetch('/api/articles', {
        method: 'POST',
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

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">New Article</h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="article-slug"
            className="font-mono text-sm"
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
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
