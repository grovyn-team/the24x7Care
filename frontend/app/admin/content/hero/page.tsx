'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import type { SiteHero } from '../../../lib/site-content-types';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

const input =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

export default function ContentHeroPage() {
  const [hero, setHero] = useState<SiteHero | null>(null);
  const [discount, setDiscount] = useState({ discount: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSiteSettingsAdmin().then((b) => setHero(b.hero));
    adminApi.getHeroDiscount().then(setDiscount);
  }, []);

  const saveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.updateSiteSettings({ hero });
      setMsg('Hero copy saved.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.updateHeroDiscount(discount);
      setMsg('Discount settings saved.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!hero) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">Loading…</div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Hero & homepage' }]}
      />

      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Hero & homepage</h1>
        <p className="mt-1 text-gray-600">Public homepage headline, body copy, WhatsApp CTA, and hero image URL.</p>
      </header>

      {msg && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-900">{msg}</div>
      )}

      <form onSubmit={saveCopy} className="space-y-5 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Greeting (line 1)</label>
            <input className={input} value={hero.greetingPart1} onChange={(e) => setHero({ ...hero, greetingPart1: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Greeting (line 2)</label>
            <input className={input} value={hero.greetingPart2} onChange={(e) => setHero({ ...hero, greetingPart2: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Headline</label>
          <input className={input} value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Paragraph 1</label>
          <textarea className={input} rows={4} value={hero.paragraph1} onChange={(e) => setHero({ ...hero, paragraph1: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Paragraph 2</label>
          <textarea className={input} rows={3} value={hero.paragraph2} onChange={(e) => setHero({ ...hero, paragraph2: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Busy CTA label</label>
            <input className={input} value={hero.busyCta} onChange={(e) => setHero({ ...hero, busyCta: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">WhatsApp number (digits, country code)</label>
            <input className={input} value={hero.whatsappNumber} onChange={(e) => setHero({ ...hero, whatsappNumber: e.target.value.replace(/\D/g, '') })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Hero image URL (optional)</label>
            <input
              className={input}
              placeholder="/doc_placeholder.png or https://…"
              value={hero.imageUrl || ''}
              onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Image alt text</label>
            <input className={input} value={hero.imageAlt || ''} onChange={(e) => setHero({ ...hero, imageAlt: e.target.value })} />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          Save hero copy
        </button>
      </form>

      <section className="max-w-md border-t border-gray-200 pt-10">
        <h2 className="text-lg font-semibold text-gray-900">Hero discount badge</h2>
        <p className="mt-1 text-sm text-gray-600">Shown when active elsewhere on the site (existing hero-discount API).</p>
        <form onSubmit={saveDiscount} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Discount %</label>
            <input
              type="number"
              min={0}
              max={100}
              className={input}
              value={discount.discount}
              onChange={(e) => setDiscount({ ...discount, discount: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={discount.isActive}
              onChange={(e) => setDiscount({ ...discount, isActive: e.target.checked })}
            />
            Active
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Save discount
          </button>
        </form>
      </section>
    </div>
  );
}
