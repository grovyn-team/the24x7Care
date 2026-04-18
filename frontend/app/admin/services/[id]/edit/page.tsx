'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/api';
import { AdminBreadcrumbs } from '../../../components/AdminBreadcrumbs';
import { ServiceForm } from '../../components/ServiceForm';
import type { Service } from '../../types';

function truncateLabel(text: string, max = 42) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export default function EditServicePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid service.');
      return;
    }
    let cancelled = false;
    (async () => {
      setError(null);
      try {
        const data = (await adminApi.getServiceById(id)) as Service;
        if (!cancelled) setService(data);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load service.');
          setService(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div>
        <AdminBreadcrumbs
          items={[
            { label: 'Services', href: '/admin/services' },
            { label: 'Edit service' },
          ]}
        />
        <div className="flex min-h-[40vh] flex-col items-start justify-center gap-3 py-12">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading service…</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div>
        <AdminBreadcrumbs
          items={[
            { label: 'Services', href: '/admin/services' },
            { label: 'Edit service' },
          ]}
        />
        <div className="border-b border-red-200 py-10">
          <p className="font-medium text-red-900">{error || 'Service not found.'}</p>
          <Link href="/admin/services" className="mt-3 inline-block text-sm font-semibold text-teal-800 hover:underline">
            Back to services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Services', href: '/admin/services' },
          { label: truncateLabel(service.title) },
          { label: 'Edit' },
        ]}
      />

      <header className="border-b border-gray-200 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">The24x7Care</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Edit service</h1>
        <p className="mt-2 max-w-2xl text-pretty text-gray-600">
          Update <span className="font-medium text-gray-800">{service.title}</span>. Changes apply on your live services listing after you save.
        </p>
      </header>

      <ServiceForm mode="edit" initialService={service} />
    </div>
  );
}
