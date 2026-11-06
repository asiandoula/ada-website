'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

type NavIcon =
  | 'today'
  | 'people'
  | 'document'
  | 'calendar'
  | 'grid'
  | 'inbox'
  | 'mail'
  | 'person';

interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

interface NavGroup {
  /** Group heading; null for the ungrouped first item. */
  label: string | null;
  items: NavItem[];
}

// Every item is an existing route under src/app/admin/(authenticated).
export const navGroups: NavGroup[] = [
  { label: null, items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: 'today' }] },
  {
    label: 'Registry',
    items: [
      { href: '/admin/doulas', label: 'People', icon: 'people' },
      { href: '/admin/certificates', label: 'Certificates', icon: 'document' },
    ],
  },
  {
    label: 'Exams',
    items: [
      { href: '/admin/exams/sessions', label: 'Sessions', icon: 'calendar' },
      // The results list, where "+ Record Exam" opens /admin/exams/record (also marked active there).
      { href: '/admin/exams', label: 'Results entry', icon: 'grid' },
    ],
  },
  { label: 'Queues', items: [{ href: '/admin/inquiries', label: 'Inbox', icon: 'inbox' }] },
  { label: 'Communications', items: [{ href: '/admin/emails', label: 'Email log', icon: 'mail' }] },
  { label: 'Site', items: [{ href: '/admin/articles', label: 'Articles', icon: 'document' }] },
  { label: 'System', items: [{ href: '/admin/profile', label: 'Profile', icon: 'person' }] },
];

const navItems = navGroups.flatMap((group) => group.items);

export function isActive(pathname: string, href: string): boolean {
  if (!pathname.startsWith(href)) return false;
  // Check if a more specific nav item matches
  const moreSpecific = navItems.some(
    (other) => other.href !== href && other.href.startsWith(href) && pathname.startsWith(other.href)
  );
  return !moreSpecific;
}

/** Line icons from the Registry Office boards: 24 grid, 1.5 stroke, square caps. */
function Icon({ name }: { name: NavIcon | 'signout' }) {
  const paths: Record<NavIcon | 'signout', React.ReactNode> = {
    today: <path d="M4 6.5h16M4 12h16M4 17.5h10" />,
    people: (
      <>
        <circle cx="12" cy="8.5" r="3.75" />
        <path d="M4.5 20c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6" />
      </>
    ),
    document: (
      <>
        <path d="M6 3.5h8l4 4v13H6z" />
        <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5.5" width="17" height="15" />
        <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
      </>
    ),
    grid: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" />
        <path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15" />
      </>
    ),
    inbox: (
      <>
        <path d="M3.5 13.5l2.5-8h12l2.5 8v6h-17z" />
        <path d="M3.5 13.5H9a3 3 0 006 0h5.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" />
        <path d="M4 6.5l8 6.5 8-6.5" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
      </>
    ),
    signout: (
      <>
        <path d="M10.5 4.5h-6v15h6" />
        <path d="M9.5 12h11M17 8.5l3.5 3.5-3.5 3.5" />
      </>
    ),
  };
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className="shrink-0"
    >
      {paths[name]}
    </svg>
  );
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
    <aside className="flex min-h-screen w-[232px] shrink-0 flex-col border-r border-ada2-record-hairline bg-ada2-record-panel px-3 pb-6 pt-3 text-ada2-record-ink">
      <Link
        href="/admin/dashboard"
        className="mb-3 flex min-h-[40px] items-center gap-2.5 px-2.5 text-ada2-record-ink no-underline"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/2026/ada-mark.svg" alt="" width={24} height={24} className="block h-6 w-6" />
        <span className="text-base font-semibold leading-5">ADA Registry Office</span>
      </Link>
      <nav aria-label="Admin" className="flex flex-1 flex-col gap-0.5">
        {navGroups.map((group) => (
          <div key={group.label ?? 'top'} className="flex flex-col gap-0.5">
            {group.label && (
              <p className="mb-1 mt-4 px-2.5 text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-ada2-record-muted">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[34px] items-center gap-2.5 rounded-[2px] border px-2.5 text-sm text-ada2-record-ink no-underline transition-colors',
                    active
                      ? 'border-ada2-record-hairline bg-white font-semibold'
                      : 'border-transparent font-medium hover:bg-ada2-retired-bg'
                  )}
                >
                  <Icon name={item.icon} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="mt-4 flex flex-col gap-0.5 border-t border-ada2-record-hairline pt-3">
      <Link
        href="/admin/profile"
        className="flex items-center gap-2.5 rounded-[2px] px-2.5 py-2 text-ada2-record-ink no-underline transition-colors hover:bg-ada2-retired-bg"
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
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ada2-record-hairline bg-white text-xs font-semibold">
            {identity?.email?.[0]?.toUpperCase() ?? '?'}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-[18px] text-ada2-record-ink">
            {identity?.email ?? 'Signed in'}
          </span>
          <span className="block text-xs leading-4 text-ada2-record-muted">Signed in · view profile</span>
        </span>
      </Link>
      <Button
        variant="ghost"
        className="h-[34px] justify-start gap-2.5 px-2.5 text-sm font-medium text-ada2-record-ink hover:bg-ada2-retired-bg hover:text-ada2-record-ink"
        onClick={handleLogout}
      >
        <Icon name="signout" />
        Sign out
      </Button>
      <p className="mt-2 px-2.5 text-xs leading-4 text-ada2-record-muted">Registry Office · English only</p>
      </div>
    </aside>
  );
}
