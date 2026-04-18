'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { adminApi } from '../../lib/api';
import { useConfirm } from '../../contexts/ConfirmContext';
import { useToast } from '../../contexts/ToastContext';
import { exportToCSV } from '../../lib/export';
import { Download, Loader2 } from 'lucide-react';
import EditEnquiryModal from './components/EditEnquiryModal';

interface Enquiry {
  _id: string;
  patient_name: string;
  patient_age: number;
  patient_mob: string;
  patient_gender?: string;
  message: string;
  service: string;
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
  const toast = useToast();
  const confirm = useConfirm();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [page, setPage] = useState(1);
  const [refetchNonce, setRefetchNonce] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 30;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      const isFirstPage = page === 1;
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);
      try {
        const response = await adminApi.getEnquiries(page, limit) as EnquiriesResponse;
        setEnquiries((prev) => (isFirstPage ? (response.data || []) : [...prev, ...(response.data || [])]));
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      } finally {
        if (isFirstPage) setLoading(false);
        else setLoadingMore(false);
      }
    };

    fetchEnquiries();
  }, [page, refetchNonce]);

  const hasMore = page < totalPages;

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    if (loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setPage((p) => (p < totalPages ? p + 1 : p));
        }
      },
      { root: null, rootMargin: '240px', threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, totalPages]);

  const refetchFromStart = () => {
    setPage(1);
    setRefetchNonce((n) => n + 1);
  };

  const visibleIds = useMemo(() => enquiries.map((e) => e._id), [enquiries]);
  const allVisibleSelected = useMemo(() => {
    if (visibleIds.length === 0) return false;
    return visibleIds.every((id) => selectedIds.has(id));
  }, [visibleIds, selectedIds]);

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
        toast.info('No data to export.');
        setExporting(false);
        return;
      }
      
      const exportData = allEnquiries.map((enquiry) => ({
        'Patient Name': enquiry.patient_name,
        'Patient Age': enquiry.patient_age,
        'Mobile Number': enquiry.patient_mob,
        'Service': enquiry.service,
        'Message': enquiry.message || '',
        'Status': enquiry.status,
        'Assignee': enquiry.assignee?.name || 'Unassigned',
        'Employee ID': enquiry.assignee?.employee_id || '',
        'Created At': new Date(enquiry.createdAt).toLocaleString(),
      }));

      const ok = exportToCSV(exportData, 'queries', [
        'Patient Name',
        'Patient Age',
        'Mobile Number',
        'Service',
        'Message',
        'Status',
        'Assignee',
        'Employee ID',
        'Created At',
      ]);
      if (ok) toast.success('Queries exported.');
      else toast.info('No data to export.');
    } catch (error) {
      console.error('Failed to export enquiries:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleEdit = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete this enquiry?',
      description: 'This will permanently remove the enquiry from the system. This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminApi.deleteEnquiry(id);
      toast.success('Enquiry deleted.');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      refetchFromStart();
    } catch (error: unknown) {
      console.error('Failed to delete enquiry:', error);
      const msg = error instanceof Error ? error.message : 'Failed to delete enquiry. Please try again.';
      toast.error(msg);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Delete ${ids.length} selected quer${ids.length === 1 ? 'y' : 'ies'}?`,
      description: 'This will permanently remove the selected enquiries. This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminApi.bulkDeleteEnquiries(ids);
      toast.success('Selected enquiries deleted.');
      setSelectedIds(new Set());
      refetchFromStart();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete selected enquiries.';
      console.error('Bulk delete enquiries failed:', error);
      toast.error(message);
    }
  };

  const handleEditSuccess = () => {
    toast.success('Enquiry updated.');
    refetchFromStart();
    adminApi.getAllDoctors().then((raw) => {
      const list = raw as Doctor[];
      if (Array.isArray(list)) setDoctors(list);
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Queries</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage patient enquiries</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-2 bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
          >
            <span>Delete selected</span>
            {selectedIds.size > 0 ? (
              <span className="ml-1 inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                {selectedIds.size}
              </span>
            ) : null}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-teal-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" strokeWidth={2} aria-hidden />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" strokeWidth={2} aria-hidden />
                <span>Export to CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-teal-700" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    aria-label="Select all visible enquiries"
                    className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
                  />
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
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
                  <td colSpan={8} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(enquiry._id)}
                        onChange={() => toggleSelectOne(enquiry._id)}
                        aria-label={`Select enquiry ${enquiry.patient_name}`}
                        className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
                      />
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enquiry.patient_name}
                      </div>
                      <div className="text-sm text-gray-500">Age: {enquiry.patient_age}</div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.patient_mob}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.service}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {enquiry.message || '-'}
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

      {!loading ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div ref={loadMoreRef} />
          {loadingMore ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-700" />
              Loading more…
            </div>
          ) : hasMore ? (
            <div className="text-xs text-gray-500">
              Showing <span className="font-medium">{enquiries.length}</span> of{' '}
              <span className="font-medium">{total}</span>. Scroll to load more.
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              End of results. Showing <span className="font-medium">{enquiries.length}</span>.
            </div>
          )}
        </div>
      ) : null}

      <AnimatePresence mode="sync">
        {editingEnquiry && (
          <EditEnquiryModal
            key={editingEnquiry._id}
            enquiry={editingEnquiry}
            doctors={doctors}
            onClose={() => setEditingEnquiry(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
