'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

export default function ContentLeadershipPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getLeadershipTeam()
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Leadership team' }]}
      />
      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Leadership team</h1>
        <p className="mt-1 text-gray-600">Each row links a designation to a doctor profile.</p>
      </header>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-gray-100">
                <td className="px-4 py-3">{r.designation}</td>
                <td className="px-4 py-3">
                  {r.member_id?.name || r.member_id} {r.member_id?.employee_id ? `(${r.member_id.employee_id})` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !err && <p className="p-4 text-sm text-gray-500">No leadership rows yet.</p>}
      </div>
    </div>
  );
}
