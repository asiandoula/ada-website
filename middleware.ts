import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Admin subdomain redirect is handled by vercel.json (edge-level, not middleware)

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
