import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // admin.asiandoula.org → redirect to /admin
  if (hostname.startsWith('admin.') && !request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin' + request.nextUrl.pathname, request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
