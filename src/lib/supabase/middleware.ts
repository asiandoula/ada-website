import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAllowedAdminEmail } from '@/lib/auth/access';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // An authenticated identity only counts as admin if its email is allowlisted.
  // A session from any other identity (e.g. self-registered signup) is treated
  // as unauthenticated for the purposes of every /admin route.
  const isAdmin = isAllowedAdminEmail(user?.email);

  // Protect /admin routes (except /admin/login)
  if (
    !isAdmin &&
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Redirect logged-in admins away from the login page. Only allowlisted users
  // are bounced to the dashboard — a non-admin session must stay on /admin/login
  // (redirecting it to the dashboard would loop against the guard above).
  if (isAdmin && request.nextUrl.pathname === '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
