'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-gray-300" aria-hidden>
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? 'font-medium text-gray-900' : 'text-gray-500'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 transition hover:text-teal-700"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
