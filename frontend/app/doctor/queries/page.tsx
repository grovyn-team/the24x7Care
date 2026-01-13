'use client';

import { useEffect, useState } from 'react';
import { doctorApi } from '../../lib/api';

interface Enquiry {
  _id: string;
  patient_name: string;
  patient_age: number;
  message: string;
  service: string;
  status: 'new' | 'viewed' | 'completed';
  createdAt: string;
}

interface EnquiriesResponse {
  data: Enquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function DoctorQueriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);
  const limit = 30;

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const response = await doctorApi.getMyEnquiries(page, limit) as EnquiriesResponse;
        setEnquiries(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [page]);

  const handleStatusUpdate = async (id: string, newStatus: 'new' | 'viewed' | 'completed') => {
    setUpdating(id);
    try {
      await doctorApi.updateEnquiryStatus(id, newStatus);
      const response = await doctorApi.getMyEnquiries(page, limit) as EnquiriesResponse;
      setEnquiries(response.data || []);
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert(error.message || 'Failed to update status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Queries</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your assigned queries</p>
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{total}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Message
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                      No queries assigned yet
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enquiry.patient_name}
                        </div>
                        <div className="text-sm text-gray-500">Age: {enquiry.patient_age}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enquiry.service}
                      </td>
                      <td className="px-3 lg:px-6 py-4 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">
                        {enquiry.message || '-'}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value as 'new' | 'viewed' | 'completed')}
                          disabled={updating === enquiry._id}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${getStatusColor(enquiry.status)} ${
                            updating === enquiry._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="viewed">Viewed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(enquiry.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
