'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavProps {
  items: { label: string; href: string }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:block sticky top-28 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm rounded-r-md border-l-3 transition-colors ${
                isActive
                  ? 'border-ada-purple bg-ada-purple/5 text-ada-purple font-semibold'
                  : 'border-transparent text-gray-600 hover:text-ada-purple hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile horizontal scroll nav */}
      <nav className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-3 py-2 text-sm rounded-full border transition-colors ${
                isActive
                  ? 'border-ada-purple bg-ada-purple text-white font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-ada-purple hover:text-ada-purple'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
