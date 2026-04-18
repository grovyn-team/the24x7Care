'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import type { SiteTestimonial } from '../../../lib/site-content-types';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

const input =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

export default function ContentTestimonialsPage() {
  const [items, setItems] = useState<SiteTestimonial[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSiteSettingsAdmin().then((b) => setItems(b.testimonials));
  }, []);

  const update = (i: number, patch: Partial<SiteTestimonial>) => {
    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };

  const add = () => setItems((prev) => [...prev, { quote: '', author: '', role: '', rating: 5 }]);
  const remove = (i: number) => setItems((prev) => prev.filter((_, j) => j !== i));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.updateSiteSettings({ testimonials: items });
      setMsg('Testimonials saved.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Testimonials' }]}
      />
      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
        <p className="mt-1 text-gray-600">Shown on the homepage; first three are highlighted in the grid.</p>
      </header>
      {msg && <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm">{msg}</div>}
      <form onSubmit={save} className="space-y-6 max-w-3xl">
        {items.map((t, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase text-gray-500">Testimonial {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <textarea
              className={input}
              rows={3}
              placeholder="Quote"
              value={t.quote}
              onChange={(e) => update(i, { quote: e.target.value })}
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={input} placeholder="Author" value={t.author} onChange={(e) => update(i, { author: e.target.value })} />
              <input className={input} placeholder="Role" value={t.role} onChange={(e) => update(i, { role: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="number"
                min={1}
                max={5}
                className={input}
                placeholder="Rating 1–5"
                value={t.rating}
                onChange={(e) => update(i, { rating: Number(e.target.value) })}
              />
              <input
                className={input}
                placeholder="Avatar URL (optional)"
                value={t.avatar || ''}
                onChange={(e) => update(i, { avatar: e.target.value })}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={add} className="text-sm font-medium text-teal-700 hover:underline">
          + Add testimonial
        </button>
        <div>
          <button type="submit" disabled={saving} className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
            Save testimonials
          </button>
        </div>
      </form>
    </div>
  );
}
