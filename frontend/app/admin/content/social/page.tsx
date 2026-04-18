'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';
import { useConfirm } from '../../../contexts/ConfirmContext';
import {
  GenericSocialIcon,
  resolveSocialPlatformKey,
  SocialPlatformIcon,
} from '../../../lib/social-platform-icons';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

interface Row {
  _id: string;
  title: string;
  href: string;
  icon_url?: string;
}

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

export default function ContentSocialPage() {
  const confirm = useConfirm();
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', href: '', icon_url: '' });

  const load = useCallback(() => {
    setErr(null);
    adminApi
      .getSocialMedia()
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ title: '', href: '', icon_url: '' });
    setEditingId(null);
    setMsg(null);
  };

  const startEdit = (r: Row) => {
    setEditingId(r._id);
    setForm({ title: r.title, href: r.href, icon_url: r.icon_url ?? '' });
    setMsg(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const payload: { title: string; href: string; icon_url?: string | null } = {
        title: form.title.trim(),
        href: form.href.trim(),
      };
      if (form.icon_url.trim()) {
        payload.icon_url = form.icon_url.trim();
      } else if (editingId) {
        payload.icon_url = null;
      }
      if (editingId) {
        await adminApi.updateSocialMedia(editingId, payload);
        setMsg('Link updated.');
      } else {
        await adminApi.createSocialMedia(payload);
        setMsg('Link added.');
      }
      resetForm();
      load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Save failed. Use a full URL (https://…) for the profile link.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const ok = await confirm({
      title: 'Remove this social link?',
      description: 'It will disappear from the site footer until you add it again.',
      confirmLabel: 'Remove',
      variant: 'danger',
    });
    if (!ok) return;
    setErr(null);
    try {
      await adminApi.deleteSocialMedia(id);
      setMsg('Removed.');
      if (editingId === id) resetForm();
      load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'Social links' }]}
      />
      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Social links</h1>
        <p className="mt-1 text-gray-600">
          Footer social buttons. The profile link must be a <strong>full URL</strong> (e.g.{' '}
          <code className="text-xs">https://www.facebook.com/yourpage</code>). Icon image is optional - common platforms get a default icon from the
          label or URL.
        </p>
      </header>

      {msg && <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-900">{msg}</div>}
      {err && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{err}</div>}

      <section className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-6">
        <h2 className="text-sm font-semibold text-gray-900">{editingId ? 'Edit link' : 'Add a link'}</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Label (e.g. Facebook)</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              placeholder="Facebook"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Profile / page URL</label>
            <input
              className={inputClass}
              type="url"
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              required
              placeholder="https://www.facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Icon image URL (optional)</label>
            <input
              className={inputClass}
              type="url"
              value={form.icon_url}
              onChange={(e) => setForm((f) => ({ ...f, icon_url: e.target.value }))}
              placeholder="https://cdn.example.com/icons/facebook.png"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank to use a built-in icon when the label or URL matches a known platform (Instagram, X, LinkedIn, etc.).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add link'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const platform = resolveSocialPlatformKey(r.title, r.href);
              return (
                <tr key={r._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3">
                    <a href={r.href} className="text-teal-700 hover:underline" target="_blank" rel="noreferrer">
                      {r.href}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-gray-500">
                        {r.icon_url?.trim() ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.icon_url} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                        ) : platform ? (
                          <SocialPlatformIcon platform={platform} className="h-6 w-6" />
                        ) : (
                          <GenericSocialIcon className="h-6 w-6" />
                        )}
                      </span>
                      <span className="max-w-[160px] truncate text-xs" title={r.icon_url ?? 'Default icon'}>
                        {r.icon_url?.trim() || 'Default icon'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" onClick={() => startEdit(r)} className="text-teal-700 text-xs font-semibold hover:underline">
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(r._id)} className="text-red-600 text-xs font-semibold hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && !err && <p className="p-4 text-sm text-gray-500">No social links yet. Use the form above to add one.</p>}
      </div>
    </div>
  );
}
