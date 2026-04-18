'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import type { Service } from '../types';

interface DeleteServiceDialogProps {
  open: boolean;
  service: Service | null;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteServiceDialog({ open, service, onClose, onDeleted }: DeleteServiceDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  if (!open || !service) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await adminApi.deleteService(service._id);
      onDeleted();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete.';
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden onClick={() => !deleting && onClose()} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-service-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="delete-service-title" className="text-lg font-semibold text-gray-900">
              Delete service?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">&ldquo;{service.title}&rdquo;</span> will be removed permanently. This cannot be undone.
            </p>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={() => !deleting && onClose()}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
