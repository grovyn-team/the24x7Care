'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import type { SiteStat } from '../../../lib/site-content-types';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

const input =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

export default function ContentStatisticsPage() {
  const [items, setItems] = useState<SiteStat[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSiteSettingsAdmin().then((b) => setItems(b.statistics));
  }, []);

  const update = (i: number, patch: Partial<SiteStat>) => {
    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };

  const add = () => setItems((prev) => [...prev, { value: '', label: '' }]);
  const remove = (i: number) => setItems((prev) => prev.filter((_, j) => j !== i));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.updateSiteSettings({ statistics: items });
      setMsg('Statistics saved.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Statistics' }]}
      />
      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Statistics strip</h1>
        <p className="mt-1 text-gray-600">Values like “15+” and labels for the animated counters.</p>
      </header>
      {msg && <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm">{msg}</div>}
      <form onSubmit={save} className="max-w-xl space-y-4">
        {items.map((s, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Value</label>
              <input className={input} value={s.value} onChange={(e) => update(i, { value: e.target.value })} />
            </div>
            <div className="flex-[2]">
              <label className="mb-1 block text-xs text-gray-500">Label</label>
              <input className={input} value={s.label} onChange={(e) => update(i, { label: e.target.value })} />
            </div>
            <button type="button" onClick={() => remove(i)} className="mb-1 text-red-600 text-sm px-2">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="text-sm font-medium text-teal-700">
          + Add row
        </button>
        <div>
          <button type="submit" disabled={saving} className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
