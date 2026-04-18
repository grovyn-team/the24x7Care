'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

interface Row {
  _id: string;
  title: string;
  description: string;
  icon_url: string;
}

export default function ContentCoreValuesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getCoreValues()
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Core values' }]}
      />
      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Core values</h1>
        <p className="mt-1 text-gray-600">
          Records power the “Why Trust Us” section when wired to the public page. Icons use image URLs from your CDN or
          uploads.
        </p>
      </header>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Icon URL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                <td className="px-4 py-3 text-gray-600 max-w-md">{r.description}</td>
                <td className="px-4 py-3 text-teal-700 truncate max-w-xs">{r.icon_url}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !err && <p className="p-4 text-sm text-gray-500">No records yet. Seed or create via API.</p>}
      </div>
    </div>
  );
}
