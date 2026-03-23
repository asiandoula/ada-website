import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // admin.asiandoula.org → redirect to main domain /admin
  if (hostname.startsWith('admin.')) {
    const mainDomain = hostname.replace('admin.', 'www.');
    return NextResponse.redirect(new URL('/admin/login', `https://${mainDomain}`));
  }

  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
