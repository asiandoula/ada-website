import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAdminEmail } from '@/lib/auth/access';

// OAuth (Google) callback. Supabase redirects here with a `code` after the
// provider dance. We exchange it for a session, then enforce the same admin
// allowlist as the rest of the app. A Google account outside the allowed
// domains is left with no usable session and bounced, never reaching /admin.
const SITE = 'https://www.asiandoula.org';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  // No code (e.g. a crafted /auth/callback?code= hit): do NOT touch the
  // caller's existing session — just bounce. Prevents a logout-CSRF where a
  // link signs out a logged-in admin.
  if (!code) {
    return NextResponse.redirect(`${SITE}/admin/login`);
  }

  // The session cookies are written onto THIS response object, so we have
  // deterministic control over them (no reliance on a network sign-out revoke).
  const response = NextResponse.redirect(`${SITE}/admin/dashboard`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  // Invalid / expired / replayed code: no session was minted for us. Return a
  // fresh redirect that touches no cookies, so a pre-existing admin session is
  // left intact.
  if (error) {
    return NextResponse.redirect(`${SITE}/admin/login?error=unauthorized`);
  }

  if (isAllowedAdminEmail(data.user?.email)) {
    return response; // carries the session cookies + redirects to the dashboard
  }

  // Authenticated but NOT allowlisted: expire the session cookies we just staged
  // and bounce. Building a fresh response and copying only expired cookies means
  // the outsider is left with no usable session regardless of any network state.
  const denied = NextResponse.redirect(`${SITE}/admin/login?error=unauthorized`);
  for (const cookie of response.cookies.getAll()) {
    denied.cookies.set(cookie.name, '', { ...cookie, maxAge: 0 });
  }
  return denied;
}
