'use client';

import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';
import { ServiceForm } from '../components/ServiceForm';

export default function NewServicePage() {
  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Services', href: '/admin/services' },
          { label: 'Add service' },
        ]}
      />

      <header className="border-b border-gray-200 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">The24x7Care</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Add service</h1>
        <p className="mt-2 max-w-2xl text-pretty text-gray-600">
          Create a new offering for your public services page. You can edit or remove it anytime from the services list.
        </p>
      </header>

      <ServiceForm mode="create" />
    </div>
  );
}
