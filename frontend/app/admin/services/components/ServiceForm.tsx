'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../lib/api';
import type { Service } from '../types';

interface ServiceFormProps {
  mode: 'create' | 'edit';
  initialService?: Service | null;
}

const fieldClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-gray-900 transition focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

export function ServiceForm({ mode, initialService }: ServiceFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState<string[]>(['']);
  const [bookVia, setBookVia] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (mode === 'edit' && initialService) {
      setTitle(initialService.title);
      setDescription(initialService.description);
      setPerks(initialService.perks?.length ? [...initialService.perks] : ['']);
      setBookVia(initialService.book_via && initialService.book_via !== '0000000000' ? initialService.book_via : '');
    }
  }, [mode, initialService]);

  const addPerkRow = () => setPerks((p) => [...p, '']);
  const removePerkRow = (index: number) => {
    setPerks((p) => (p.length <= 1 ? [''] : p.filter((_, i) => i !== index)));
  };
  const setPerkAt = (index: number, value: string) => {
    setPerks((p) => p.map((x, i) => (i === index ? value : x)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPerks = perks.map((p) => p.trim()).filter(Boolean);
    const bv = bookVia.trim();

    if (bv && !/^\d{10}$/.test(bv)) {
      setError('Book-via number must be exactly 10 digits, or leave empty.');
      return;
    }

    const payload: {
      title: string;
      description: string;
      perks: string[];
      book_via?: string;
    } = {
      title: title.trim(),
      description: description.trim(),
      perks: trimmedPerks,
    };

    if (bv) {
      payload.book_via = bv;
    } else if (mode === 'edit') {
      payload.book_via = '0000000000';
    }

    if (!payload.title || !payload.description) {
      setError('Title and description are required.');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        await adminApi.createService(payload);
      } else if (initialService) {
        await adminApi.updateService(initialService._id, payload);
      }
      router.push('/admin/services');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-0 pb-8">
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <section className="border-b border-gray-200/90 py-8 first:pt-0">
        <h2 className="text-sm font-semibold text-gray-900">Basics</h2>
        <p className="mt-1 text-sm text-gray-500">Title and description appear on your public services listing.</p>
        <div className="mt-6 max-w-3xl space-y-6">
          <div>
            <label htmlFor="svc-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Title
            </label>
            <input
              id="svc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={fieldClass}
              placeholder="e.g. Home Nursing"
            />
          </div>
          <div>
            <label htmlFor="svc-desc" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </label>
            <textarea
              id="svc-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className={`${fieldClass} resize-y`}
              placeholder="Short summary of what this service includes."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200/90 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Perks</h2>
            <p className="mt-1 text-sm text-gray-500">Bullet points visitors see under this service.</p>
          </div>
          <button
            type="button"
            onClick={addPerkRow}
            className="shrink-0 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            + Add perk
          </button>
        </div>
        <div className="mt-6 max-w-3xl space-y-2">
          {perks.map((perk, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={perk}
                onChange={(e) => setPerkAt(index, e.target.value)}
                className={`${fieldClass} min-w-0 flex-1 text-sm`}
                placeholder={`Perk ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removePerkRow(index)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove perk"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-gray-200/90 py-8">
        <h2 className="text-sm font-semibold text-gray-900">Booking</h2>
        <p className="mt-1 text-sm text-gray-500">Optional dedicated number for this service.</p>
        <div className="mt-6 max-w-md">
          <label htmlFor="svc-book" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Book via (optional)
          </label>
          <input
            id="svc-book"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={bookVia}
            onChange={(e) => setBookVia(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className={fieldClass}
            placeholder="10-digit number"
          />
          <p className="mt-1.5 text-xs text-gray-400">Leave empty to use the default booking number.</p>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => !saving && router.push('/admin/services')}
          className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50 sm:min-w-[160px]"
        >
          {saving ? 'Saving…' : mode === 'create' ? 'Create service' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
