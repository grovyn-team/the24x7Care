'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import { exportToCSV } from '../../lib/export';
import EditEnquiryModal from './components/EditEnquiryModal';

interface Enquiry {
  _id: string;
  patient_name: string;
  patient_age: number;
  patient_mob: string;
  message: string;
  status: 'new' | 'viewed' | 'completed';
  assignee?: {
    _id?: string;
    name: string;
    employee_id: string;
  };
  createdAt: string;
}

interface EnquiriesResponse {
  data: Enquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Doctor {
  _id: string;
  name: string;
  employee_id: string;
}

export default function QueriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 30;

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getEnquiries(page, limit) as EnquiriesResponse;
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminApi.getAllDoctors() as Doctor[];
        setDoctors(response || []);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const allEnquiries = await adminApi.getAllEnquiries() as Enquiry[];
      
      if (!allEnquiries || allEnquiries.length === 0) {
        alert('No data to export');
        setExporting(false);
        return;
      }
      
      const exportData = allEnquiries.map((enquiry) => ({
        'Patient Name': enquiry.patient_name,
        'Patient Age': enquiry.patient_age,
        'Mobile Number': enquiry.patient_mob,
        'Message': enquiry.message,
        'Status': enquiry.status,
        'Assignee': enquiry.assignee?.name || 'Unassigned',
        'Employee ID': enquiry.assignee?.employee_id || '',
        'Created At': new Date(enquiry.createdAt).toLocaleString(),
      }));

      exportToCSV(exportData, 'queries', [
        'Patient Name',
        'Patient Age',
        'Mobile Number',
        'Message',
        'Status',
        'Assignee',
        'Employee ID',
        'Created At',
      ]);
    } catch (error) {
      console.error('Failed to export enquiries:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleEdit = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteEnquiry(id);
      const response = await adminApi.getEnquiries(page, limit) as EnquiriesResponse;
      setEnquiries(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Failed to delete enquiry:', error);
      alert(error.message || 'Failed to delete enquiry. Please try again.');
    }
  };

  const handleEditSuccess = () => {
    const fetchEnquiries = async () => {
      try {
        const response = await adminApi.getEnquiries(page, limit) as EnquiriesResponse;
        setEnquiries(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      }
    };
    fetchEnquiries();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Queries</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage patient enquiries</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-teal-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export to CSV</span>
            </>
          )}
        </button>
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
                  Mobile
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enquiry.patient_name}
                      </div>
                      <div className="text-sm text-gray-500">Age: {enquiry.patient_age}</div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.patient_mob}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {enquiry.message}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.assignee?.name || 'Unassigned'}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(enquiry)}
                        className="text-teal-700 hover:text-teal-800 font-medium mr-3 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(enquiry._id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 px-4 lg:px-6 py-4 shadow-lg z-40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 sm:gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-teal-700 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {editingEnquiry && (
        <EditEnquiryModal
          enquiry={editingEnquiry}
          doctors={doctors}
          onClose={() => setEditingEnquiry(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
