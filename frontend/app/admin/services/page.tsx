'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';

interface Service {
  _id: string;
  title: string;
  description: string;
  perks: string[];
  book_via: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await adminApi.getServices() as Service[];
        setServices(data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage healthcare services</p>
        </div>
        <button className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors">
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              No services found
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                {service.perks && service.perks.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Perks:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      {service.perks.map((perk, index) => (
                        <li key={index}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-teal-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
