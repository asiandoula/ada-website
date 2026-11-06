'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navGroups, isActive } from '@/components/admin/sidebar';

/**
 * Page-head breadcrumb ("Registry / People"), from the sidebar's own nav and
 * active-item rule. On a page below a nav item (a record, "new", "generate")
 * the item links back to its list; the page's H1 names the record.
 */
export function AdminBreadcrumb() {
  const pathname = usePathname();

  for (const group of navGroups) {
    const item = group.items.find((candidate) => isActive(pathname, candidate.href));
    if (!item) continue;
    const atItem = pathname === item.href;
    return (
      <nav aria-label="Breadcrumb" className="mb-2 text-[13px] leading-[18px] text-ada2-record-muted">
        {group.label && (
          <>
            <span>{group.label}</span>
            <span aria-hidden="true"> / </span>
          </>
        )}
        {atItem ? (
          <span aria-current="page" className="text-ada2-record-ink">
            {item.label}
          </span>
        ) : (
          <Link
            href={item.href}
            className="text-[#23407A] underline underline-offset-[3px] hover:text-ada2-record-ink"
          >
            {item.label}
          </Link>
        )}
      </nav>
    );
  }
  return null;
}
