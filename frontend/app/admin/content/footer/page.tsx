'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

const input =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

export default function ContentFooterPage() {
  const [tagline, setTagline] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSiteSettingsAdmin().then((b) => {
      const f = b.footer;
      setTagline(f.tagline);
      setAddressLine1(f.addressLine1);
      setAddressLine2(f.addressLine2);
      setAddressLine3(f.addressLine3 ?? '');
      setContactPhone(f.contactPhone);
      setContactEmail(f.contactEmail);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.updateSiteSettings({
        footer: {
          tagline,
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          addressLine3: addressLine3.trim(),
          contactPhone: contactPhone.trim(),
          contactEmail: contactEmail.trim(),
        },
      });
      setMsg('Footer saved.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Footer & brand' }]}
      />
      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Footer & brand</h1>
        <p className="mt-1 text-gray-600">
          Tagline under the logo, and the &quot;Contact us&quot; block in the footer and on the contact page.
        </p>
      </header>
      {msg && <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm">{msg}</div>}
      <form onSubmit={save} className="max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Tagline</label>
          <textarea className={input} rows={4} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Address line 1</label>
            <input className={input} value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Address line 2</label>
            <input className={input} value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Address line 3 (optional)</label>
            <input className={input} value={addressLine3} onChange={(e) => setAddressLine3(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Phone (display)</label>
            <input className={input} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            <p className="mt-1 text-xs text-gray-500">Dial link is generated from digits and +.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Email</label>
            <input className={input} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={saving} className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
}
