'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { adminApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { useToast } from '../../contexts/ToastContext';
import { exportToCSV } from '../../lib/export';
import { Download, Loader2 } from 'lucide-react';
interface Patient {
  _id: string;
  patient_name: string;
  patient_age: string;
  patient_gender: 'male' | 'female' | 'others';
  patient_mob: string;
  queries_raised: string[];
  createdAt: string;
}

interface PatientsResponse {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function PatientsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const { isAdmin } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [refetchNonce, setRefetchNonce] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 30;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      const isFirstPage = page === 1;
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);
      try {
        const response = await adminApi.getPatients(page, limit) as PatientsResponse;
        setPatients((prev) => (isFirstPage ? (response.data || []) : [...prev, ...(response.data || [])]));
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        if (isFirstPage) setLoading(false);
        else setLoadingMore(false);
      }
    };

    fetchPatients();
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

  const visibleIds = useMemo(() => patients.map((p) => p._id), [patients]);
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

  const handleDelete = async (patient: Patient) => {
    const ok = await confirm({
      title: 'Delete this patient record?',
      description: `Remove the saved profile for ${patient.patient_name} (${patient.patient_mob}). You can only delete a patient after every linked enquiry has been removed from Queries.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminApi.deletePatient(patient._id);
      toast.success('Patient record deleted.');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(patient._id);
        return next;
      });
      refetchFromStart();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete patient.';
      console.error('Failed to delete patient:', error);
      toast.error(message);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Delete ${ids.length} selected patient record${ids.length === 1 ? '' : 's'}?`,
      description:
        'This removes only patient rows whose linked enquiries are already deleted. If any selection still has enquiries in Queries, the whole action is cancelled.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminApi.bulkDeletePatients(ids);
      toast.success('Selected patient records deleted.');
      setSelectedIds(new Set());
      refetchFromStart();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete selected patients.';
      console.error('Bulk delete patients failed:', error);
      toast.error(message);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const allPatients = await adminApi.getAllPatients() as Patient[];
      
      if (!allPatients || allPatients.length === 0) {
        toast.info('No data to export.');
        setExporting(false);
        return;
      }
      
      const exportData = allPatients.map((patient) => ({
        'Patient Name': patient.patient_name,
        'Age': patient.patient_age,
        'Gender': patient.patient_gender,
        'Mobile Number': patient.patient_mob,
        'Total Queries': patient.queries_raised?.length || 0,
        'Created At': new Date(patient.createdAt).toLocaleString(),
      }));

      const ok = exportToCSV(exportData, 'patients', [
        'Patient Name',
        'Age',
        'Gender',
        'Mobile Number',
        'Total Queries',
        'Created At',
      ]);
      if (ok) toast.success('Patients exported.');
      else toast.info('No data to export.');
    } catch (error) {
      console.error('Failed to export patients:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage patient records</p>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm max-w-2xl">
            Rows are grouped by mobile number. Name and age stay as on the first enquiry for that number; newer
            submissions still appear in Queries with the details entered each time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
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
          ) : null}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center max-w-[150px] sm:max-w-none gap-2 bg-teal-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
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
            <table className="w-full min-w-[720px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin ? (
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible patients"
                      className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
                    />
                  </th>
                ) : null}
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Queries
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                {isAdmin ? (
                  <th className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 6} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient._id}>
                    {isAdmin ? (
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(patient._id)}
                          onChange={() => toggleSelectOne(patient._id)}
                          aria-label={`Select patient ${patient.patient_name}`}
                          className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
                        />
                      </td>
                    ) : null}
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.patient_name}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_age}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {patient.patient_gender}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_mob}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                        {patient.queries_raised?.length || 0}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>
                    {isAdmin ? (
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          type="button"
                          onClick={() => handleDelete(patient)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    ) : null}
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
              Showing <span className="font-medium">{patients.length}</span> of{' '}
              <span className="font-medium">{total}</span>. Scroll to load more.
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              End of results. Showing <span className="font-medium">{patients.length}</span>.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
