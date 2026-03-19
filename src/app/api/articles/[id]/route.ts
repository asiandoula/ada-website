import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const VALID_STATUSES = ['draft', 'published', 'archived'] as const;
const VALID_CATEGORIES = ['general', 'news', 'education', 'community', 'certification'] as const;

async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  const { data, error } = await adminClient
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json({ article: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content, excerpt, cover_image, category, status: articleStatus, author } = body;

  if (articleStatus && !VALID_STATUSES.includes(articleStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  // Build update object with only provided fields
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) update.title = title.trim();
  if (slug !== undefined) update.slug = slug.trim();
  if (content !== undefined) update.content = content;
  if (excerpt !== undefined) update.excerpt = excerpt?.trim() || null;
  if (cover_image !== undefined) update.cover_image = cover_image || null;
  if (category !== undefined) update.category = category;
  if (author !== undefined) update.author = author?.trim() || null;

  if (articleStatus !== undefined) {
    update.status = articleStatus;
    // Set published_at when first publishing
    if (articleStatus === 'published') {
      const { data: existing } = await adminClient
        .from('articles')
        .select('published_at')
        .eq('id', id)
        .single();
      if (!existing?.published_at) {
        update.published_at = new Date().toISOString();
      }
    }
  }

  const { data, error } = await adminClient
    .from('articles')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ article: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await adminClient
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
