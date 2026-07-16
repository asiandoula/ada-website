'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/doulas', label: 'Doulas', icon: '👤' },
  { href: '/admin/exams', label: 'Exams', icon: '📝' },
  { href: '/admin/certificates', label: 'Certificates', icon: '📜' },
  { href: '/admin/articles', label: 'Articles', icon: '📰' },
  { href: '/admin/emails', label: 'Emails', icon: '✉️' },
  { href: '/admin/exams/sessions', label: 'Offline Exam', icon: '🎓' },
];

function isActive(pathname: string, href: string): boolean {
  if (!pathname.startsWith(href)) return false;
  // Check if a more specific nav item matches
  const moreSpecific = navItems.some(
    (other) => other.href !== href && other.href.startsWith(href) && pathname.startsWith(other.href)
  );
  return !moreSpecific;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [identity, setIdentity] = useState<{ email: string; avatar?: string } | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIdentity({
          email: user.email ?? '',
          avatar: (user.user_metadata?.avatar_url as string | undefined) ?? undefined,
        });
      }
    });
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-64 bg-ada-navy text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src="/ada-logo.svg" alt="ADA" className="h-8 w-8" />
        <span className="font-semibold text-lg">ADA Admin</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              isActive(pathname, item.href)
                ? 'bg-ada-purple text-white'
                : 'text-gray-300 hover:bg-white/10'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/admin/profile"
        className={cn(
          'mt-2 flex items-center gap-2 rounded-md px-2 py-2 transition-colors',
          pathname.startsWith('/admin/profile') ? 'bg-white/10' : 'hover:bg-white/10'
        )}
      >
        {identity?.avatar && !avatarBroken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={identity.avatar}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarBroken(true)}
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs">
            {identity?.email?.[0]?.toUpperCase() ?? '?'}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs text-gray-300">
            {identity?.email ?? 'Signed in'}
          </span>
          <span className="block text-[10px] text-gray-500">View profile</span>
        </span>
      </Link>
      <Button
        variant="ghost"
        className="text-gray-400 hover:text-white hover:bg-white/10 justify-start"
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    </aside>
  );
}
