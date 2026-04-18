'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LayoutTemplate } from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { ContentSummaryCounts } from '../../lib/site-content-types';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';
import { CONTENT_SECTION_CARDS } from './content-sections';

export default function ContentManagementPage() {
  const [counts, setCounts] = useState<ContentSummaryCounts | null>(null);

  useEffect(() => {
    adminApi
      .getContentSummary()
      .then(setCounts)
      .catch(() => setCounts(null));
  }, []);

  return (
    <div className="space-y-8">
      <AdminBreadcrumbs items={[{ label: 'Content management' }]} />

      <header className="border-b border-gray-200 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">The24x7Care</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Content management</h1>
        <p className="mt-2 max-w-3xl text-pretty text-gray-600">
          Manage live website copy and linked records from one place. Counts refresh from your database; open a card to
          edit that area.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">Website sections</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CONTENT_SECTION_CARDS.map((card) => {
            const n = card.countKey && counts ? counts[card.countKey] : undefined;
            return (
              <Link
                key={card.id}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                    <LayoutTemplate className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  {typeof n === 'number' && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                      {n}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{card.description}</p>
                <span className="mt-4 text-sm font-semibold text-teal-700">
                  Open <span aria-hidden>→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
