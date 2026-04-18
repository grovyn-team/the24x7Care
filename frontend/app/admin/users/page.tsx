'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { adminApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { useToast } from '../../contexts/ToastContext';
import { exportToCSV } from '../../lib/export';
import {
  Check,
  Download,
  Info,
  Loader2,
  PenLine,
  Plus,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  mobile: string;
  employee_id: string;
  gender: string;
  queries_assigned?: any[] | string[];
}

interface DoctorsResponse {
  data: Doctor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AddDoctorFormData {
  name: string;
  specialization: string;
  mobile: string;
  employee_id: string;
  gender: Gender;
  avatar_url?: string;
}

export default function UsersPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const { isAdmin } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [refetchNonce, setRefetchNonce] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const limit = 30;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<AddDoctorFormData>({
    name: '',
    specialization: '',
    mobile: '',
    employee_id: '',
    gender: Gender.MALE,
    avatar_url: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const isFirstPage = page === 1;
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);
      try {
        const response = await adminApi.getDoctors(page, limit) as DoctorsResponse;
        setDoctors((prev) => (isFirstPage ? (response.data || []) : [...prev, ...(response.data || [])]));
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        if (isFirstPage) setLoading(false);
        else setLoadingMore(false);
      }
    };

    fetchDoctors();
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

  const visibleIds = useMemo(() => doctors.map((d) => d._id), [doctors]);
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

  const refetchFromStart = () => {
    setPage(1);
    setRefetchNonce((n) => n + 1);
  };

  const handleDelete = async (doctor: Doctor) => {
    const ok = await confirm({
      title: 'Delete this doctor?',
      description: `This will permanently remove ${doctor.name} (${doctor.employee_id}). This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminApi.deleteDoctor(doctor._id);
      toast.success('Doctor deleted.');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(doctor._id);
        return next;
      });
      refetchFromStart();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete doctor.';
      console.error('Failed to delete doctor:', error);
      toast.error(message);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Delete ${ids.length} selected doctor${ids.length === 1 ? '' : 's'}?`,
      description: 'This will permanently remove the selected doctor accounts. Assigned enquiries will be unassigned.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminApi.bulkDeleteDoctors(ids);
      toast.success('Selected doctors deleted.');
      setSelectedIds(new Set());
      refetchFromStart();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete selected doctors.';
      console.error('Bulk delete doctors failed:', error);
      toast.error(message);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const allDoctors = await adminApi.getAllDoctors() as Doctor[];
      
      if (!allDoctors || allDoctors.length === 0) {
        toast.info('No data to export.');
        setExporting(false);
        return;
      }
      
      const exportData = allDoctors.map((doctor) => ({
        'Name': doctor.name,
        'Specialization': doctor.specialization,
        'Mobile': doctor.mobile,
        'Employee ID': doctor.employee_id,
        'Gender': doctor.gender,
      }));

      const ok = exportToCSV(exportData, 'doctors', [
        'Name',
        'Specialization',
        'Mobile',
        'Employee ID',
        'Gender',
      ]);
      if (ok) toast.success('Doctor list exported.');
      else toast.info('No data to export.');
    } catch (error) {
      console.error('Failed to export doctors:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const emptyDoctorForm = (): AddDoctorFormData => ({
    name: '',
    specialization: '',
    mobile: '',
    employee_id: '',
    gender: Gender.MALE,
    avatar_url: '',
  });

  const openAddDoctorModal = () => {
    setEditingDoctorId(null);
    setFormData(emptyDoctorForm());
    setShowAddModal(true);
  };

  const openEditDoctorModal = (doctor: Doctor) => {
    setEditingDoctorId(doctor._id);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      mobile: doctor.mobile,
      employee_id: doctor.employee_id,
      gender: doctor.gender === Gender.FEMALE ? Gender.FEMALE : Gender.MALE,
      avatar_url: '',
    });
    setShowAddModal(true);
  };

  const closeDoctorModal = (force = false) => {
    if (!force && formLoading) return;
    setShowAddModal(false);
    setEditingDoctorId(null);
    setFormData(emptyDoctorForm());
  };

  const handleDoctorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.avatar_url) {
        delete dataToSend.avatar_url;
      }

      if (editingDoctorId) {
        const { employee_id: _omitEmployeeId, ...updates } = dataToSend;
        await adminApi.updateDoctor(editingDoctorId, updates);
        setSuccessMessage(`Doctor "${formData.name}" updated successfully!`);
      } else {
        await adminApi.createDoctor(dataToSend);
        setSuccessMessage(`Doctor "${formData.name}" added successfully!`);
      }

      closeDoctorModal(true);
      refetchFromStart();
    } catch (error: unknown) {
      console.error('Failed to save doctor:', error);
      const msg = error instanceof Error ? error.message : 'Failed to save doctor. Please try again.';
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const parseCSV = (csvText: string): AddDoctorFormData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const dataLines = lines[0].toLowerCase().includes('name') ? lines.slice(1) : lines;
    
    const doctors: AddDoctorFormData[] = [];
    
    for (const line of dataLines) {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      if (values.length < 5) continue;

      const [name, specialization, mobile, employee_id, gender, avatar_url] = values;
      
      if (!/^[0-9]{10}$/.test(mobile)) {
        continue;
      }

      const normalizedGender = gender.toLowerCase() === 'female' ? Gender.FEMALE : Gender.MALE;

      doctors.push({
        name,
        specialization,
        mobile,
        employee_id,
        gender: normalizedGender,
        avatar_url: avatar_url || undefined,
      });
    }

    return doctors;
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.warning('Please upload a CSV file.');
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      const doctorsData = parseCSV(text);

      if (doctorsData.length === 0) {
        toast.warning('No valid doctors found in that CSV. Check the format and mobile numbers (10 digits).');
        setUploading(false);
        return;
      }

      const response = await adminApi.createDoctorsBulk(doctorsData) as {
        totalCreated: number;
        totalErrors: number;
      };

      if (response.totalCreated > 0) {
        setSuccessMessage(`${response.totalCreated} doctor(s) added successfully!`);
        refetchFromStart();
      }

      if (response.totalErrors > 0) {
        toast.warning(
          `${response.totalCreated} doctor(s) added, but ${response.totalErrors} row(s) failed. Check the data and try again.`,
        );
      }
    } catch (error: any) {
      console.error('Failed to upload CSV:', error);
      toast.error(error.message || 'Failed to upload CSV. Please check the format and try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {successMessage ? (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in">
          <Check className="w-6 h-6 shrink-0" strokeWidth={2} aria-hidden />
          <span className="font-medium">{successMessage}</span>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage doctors and staff</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className={`flex items-center gap-2 bg-white text-teal-700 border-2 border-teal-700 px-3 lg:px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer text-sm lg:text-base ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-teal-700" strokeWidth={2} aria-hidden />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" strokeWidth={2} aria-hidden />
                <span>Upload CSV</span>
              </>
            )}
          </label>
          <button
            onClick={openAddDoctorModal}
            className="flex items-center gap-2 bg-teal-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors text-sm lg:text-base"
          >
            <Plus className="w-5 h-5" strokeWidth={2} aria-hidden />
            <span>Add Doctor</span>
          </button>
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

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="presentation"
        >
          <div className="absolute inset-0 bg-gray-900/45 backdrop-blur-[2px]" aria-hidden />
          <div
            className="relative flex max-h-[min(92vh,44rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-2xl shadow-gray-900/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-doctor-title"
          >
            <div className="shrink-0 bg-gradient-to-r from-teal-700 to-teal-800 px-5 py-4 text-white sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    {editingDoctorId ? (
                      <PenLine className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
                    ) : (
                      <User className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
                    )}
                  </div>
                  <div>
                    <h2 id="add-doctor-title" className="text-lg font-semibold tracking-tight sm:text-xl">
                      {editingDoctorId ? 'Edit doctor' : 'Add doctor'}
                    </h2>
                    <p className="mt-0.5 text-sm text-teal-100/95">
                      Required fields are marked with <span className="text-red-200">*</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => closeDoctorModal()}
                  disabled={formLoading}
                  className="rounded-lg p-1.5 text-white/90 transition-colors hover:bg-white/15 disabled:opacity-40"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>

            <form onSubmit={handleDoctorFormSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Profile</p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-800">
                          Full name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                          required
                          placeholder="Dr. John Smith"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="specialization" className="mb-1.5 block text-sm font-medium text-gray-800">
                          Specialization <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="specialization"
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                          required
                          placeholder="e.g. Cardiology"
                          autoComplete="organization-title"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact &amp; ID</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-gray-800">
                          Mobile <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="mobile"
                          type="text"
                          inputMode="numeric"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          placeholder="9876543210"
                          autoComplete="tel"
                        />
                        <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-gray-100">
                          <Info className="h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2} aria-hidden />
                          Exactly 10 digits, no spaces or country code
                        </p>
                      </div>
                      <div>
                        <label htmlFor="employee_id" className="mb-1.5 block text-sm font-medium text-gray-800">
                          Employee ID <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="employee_id"
                          type="text"
                          value={formData.employee_id}
                          onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600"
                          required
                          disabled={Boolean(editingDoctorId)}
                          placeholder="DOC001"
                          autoComplete="off"
                        />
                        {editingDoctorId ? (
                          <p className="mt-1 text-xs text-gray-500">Employee ID cannot be changed after creation.</p>
                        ) : null}
                      </div>
                      <div>
                        <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-gray-800">
                          Gender <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                          required
                        >
                          <option value={Gender.MALE}>Male</option>
                          <option value={Gender.FEMALE}>Female</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="avatar_url" className="mb-1.5 block text-sm font-medium text-gray-800">
                      Avatar URL <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <input
                      id="avatar_url"
                      type="url"
                      value={formData.avatar_url || ''}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-gray-100 bg-gray-50/95 px-5 py-4 sm:px-6">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={() => closeDoctorModal()}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 sm:w-auto sm:min-w-[7rem]"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[10rem]"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" strokeWidth={2} aria-hidden />
                        {editingDoctorId ? 'Saving…' : 'Adding…'}
                      </>
                    ) : editingDoctorId ? (
                      <>
                        <PenLine className="h-4 w-4" strokeWidth={2} aria-hidden />
                        Save changes
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                        Add doctor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-teal-700" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin ? (
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible doctors"
                      className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
                    />
                  </th>
                ) : null}
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queries Assigned
                </th>
                {isAdmin ? (
                  <th className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    {isAdmin ? (
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(doctor._id)}
                          onChange={() => toggleSelectOne(doctor._id)}
                          aria-label={`Select doctor ${doctor.name}`}
                          className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
                        />
                      </td>
                    ) : null}
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doctor.name}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.specialization}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.mobile}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.employee_id}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {doctor.queries_assigned?.length || 0}
                      </span>
                    </td>
                    {isAdmin ? (
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="inline-flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            onClick={() => openEditDoctorModal(doctor)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            aria-label={`Edit ${doctor.name}`}
                          >
                            <PenLine className="h-4 w-4" strokeWidth={2} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doctor)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                            aria-label={`Delete ${doctor.name}`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                          </button>
                        </div>
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
              Showing <span className="font-medium">{doctors.length}</span> of{' '}
              <span className="font-medium">{total}</span>. Scroll to load more.
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              End of results. Showing <span className="font-medium">{doctors.length}</span>.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
