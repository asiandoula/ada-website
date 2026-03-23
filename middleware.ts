import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // admin.asiandoula.org → redirect to www.asiandoula.org/admin/login
  if (hostname.startsWith('admin.')) {
    return NextResponse.redirect('https://www.asiandoula.org/admin/login', 308);
  }

  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
