'use client';

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
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

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
              pathname.startsWith(item.href)
                ? 'bg-ada-purple text-white'
                : 'text-gray-300 hover:bg-white/10'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
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
