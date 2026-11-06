'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ENTITY } from '@/lib/facts';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'unauthorized') {
      setError('This Google account is not authorized for admin access.');
    }
  }, []);

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.asiandoula.org/auth/callback' },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-ada2-record-panel text-ada2-record-ink">
      <main className="flex flex-1 items-center justify-center px-4 pb-8 pt-16">
        <div className="flex w-full max-w-[420px] flex-col gap-5">
          <section
            aria-labelledby="li-title"
            className="flex flex-col gap-6 rounded-[2px] border border-ada2-record-hairline bg-white px-10 pb-8 pt-10 max-[480px]:px-6"
          >
            <div className="flex flex-col items-start gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/2026/ada-mark.svg" alt="" width={40} height={40} className="block h-10 w-10" />
              <div className="flex flex-col gap-1">
                <h1 id="li-title" className="m-0 text-2xl font-semibold leading-8 tracking-[-0.005em]">
                  ADA Registry Office
                </h1>
                <p className="m-0 text-sm text-ada2-record-muted">Asian Doula Alliance · staff sign-in</p>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-2.5">
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="h-11 w-full gap-2.5 rounded-[2px] border border-ada2-record-ink bg-white px-4 text-[15px] font-semibold text-ada2-record-ink hover:bg-ada2-record-panel"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    aria-hidden="true"
                  >
                    <path d="M13.5 4.5h6v15h-6" />
                    <path d="M3.5 12h11M11 8.5l3.5 3.5-3.5 3.5" />
                  </svg>
                  Sign in with Google
                </Button>
                <p className="m-0 text-[13px] leading-[18px] text-ada2-record-muted [text-wrap:pretty]">
                  Use your staff Google account. Each staff member signs in
                  with their own name.
                </p>
              </div>

              {error && !showPassword && (
                <p className="m-0 mt-4 text-sm text-ada2-suspended">{error}</p>
              )}

              {showPassword && (
                <form
                  onSubmit={handleLogin}
                  className="mt-5 flex flex-col gap-3.5 border-t border-ada2-record-hairline pt-5"
                >
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-[13px] font-semibold leading-[18px]">
                      Staff email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10 bg-white px-2.5 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password" className="text-[13px] font-semibold leading-[18px]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10 bg-white px-2.5 text-sm"
                    />
                  </div>
                  {error && <p className="m-0 text-sm text-ada2-suspended">{error}</p>}
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-[2px] border border-ada2-record-ink bg-ada2-record-ink px-4 text-[15px] font-semibold text-white hover:bg-ada-navy-warm"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-1.5 border-t-2 border-ada2-record-ink pt-4">
                <p className="m-0 text-[15px] font-semibold leading-[22px]">
                  Staff accounts only. Doulas sign in at{' '}
                  <Link href="/portal" className="text-ada2-record-ink underline underline-offset-[3px]">
                    My ADA
                  </Link>
                  .
                </p>
                <p className="m-0 text-[13px] leading-[18px] text-ada2-record-muted [text-wrap:pretty]">
                  Candidates and certified doulas use My ADA to see their record, exam results and certificates.
                </p>
              </div>

              {!showPassword && (
                <button
                  type="button"
                  onClick={() => { setShowPassword(true); setError(''); }}
                  className="mt-4 inline-flex min-h-8 items-center p-0 text-[13px] font-semibold leading-[18px] text-ada2-record-muted underline underline-offset-[3px] hover:text-ada2-record-ink"
                >
                  Trouble with Google? Sign in with password
                </button>
              )}
            </div>
          </section>

          <p className="m-0 text-center text-xs leading-4 text-ada2-record-muted">Registry Office · English only</p>
        </div>
      </main>

      <footer className="px-6 pb-6 pt-4 text-center text-xs leading-4 text-ada2-record-muted [text-wrap:balance]">
        {ENTITY.dba} is a dba of {ENTITY.legalName}, a {ENTITY.corporation} · EIN {ENTITY.ein}
      </footer>
    </div>
  );
}
