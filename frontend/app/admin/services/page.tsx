'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { LayoutGrid, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';
import { DeleteServiceDialog } from './components/DeleteServiceDialog';
import type { Service } from './types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    setLoadError(null);
    try {
      const data = (await adminApi.getServices()) as Service[];
      setServices(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      console.error('Failed to fetch services:', error);
      const msg = error instanceof Error ? error.message : 'Failed to load services.';
      setLoadError(msg);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openDelete = (service: Service) => {
    setDeletingService(service);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-8">
      <AdminBreadcrumbs items={[{ label: 'Services' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">The24x7Care</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Services</h1>
          <p className="mt-1 text-gray-600">Manage healthcare services shown on your public site.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add service
        </Link>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</div>
      )}

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
            <p className="text-sm text-gray-500">Loading services…</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/80 to-white py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <LayoutGrid className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-medium text-gray-900">No services yet</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">Create your first service to display offerings on the website.</p>
              <Link
                href="/admin/services/new"
                className="mt-6 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-800"
              >
                Add service
              </Link>
            </div>
          ) : (
            services.map((service) => (
              <article
                key={service._id}
                className="group flex flex-col rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm shadow-gray-900/[0.03] ring-1 ring-black/[0.02] transition hover:border-teal-200/80 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold leading-snug text-gray-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-4">{service.description}</p>

                {service.perks && service.perks.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Perks</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
                      {service.perks.slice(0, 5).map((perk, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal-500" />
                          <span>{perk}</span>
                        </li>
                      ))}
                      {service.perks.length > 5 && (
                        <li className="text-gray-400">+{service.perks.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                  <Link
                    href={`/admin/services/${service._id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => openDelete(service)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50/80 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      <DeleteServiceDialog
        open={deleteOpen}
        service={deletingService}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingService(null);
        }}
        onDeleted={fetchServices}
      />
    </div>
  );
}
