'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, User, X } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

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
}

interface Doctor {
  _id: string;
  name: string;
  employee_id: string;
}

interface EditEnquiryModalProps {
  enquiry: Enquiry | null;
  doctors: Doctor[];
  onClose: () => void;
  onSuccess: () => void;
}

const scrollBody = 'min-h-0 flex-1 overflow-y-auto overscroll-contain';

const selectClass =
  'w-full cursor-pointer appearance-none rounded-xl border border-slate-200/90 bg-white px-4 py-3 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus:border-teal-600/80 focus:outline-none focus:ring-2 focus:ring-teal-600/20';

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDown className="h-4 w-4" aria-hidden strokeWidth={2} />
      </span>
    </div>
  );
}

const backdropTransition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };
const panelTransition = { type: 'spring' as const, damping: 32, stiffness: 400 };

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50/80 px-3.5 py-3 ring-1 ring-slate-200/50">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium leading-snug text-slate-900">{children}</dd>
    </div>
  );
}

const GENDER_OPTIONS = ['Male', 'Female', 'Others'] as const;

function hasStoredGender(gender: string | undefined | null): boolean {
  return typeof gender === 'string' && gender.trim().length > 0;
}

export default function EditEnquiryModal({ enquiry, doctors, onClose, onSuccess }: EditEnquiryModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    status: 'new' as 'new' | 'viewed' | 'completed',
    assignee: '',
    patient_gender: '' as string,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enquiry) {
      let assigneeId = '';
      if (enquiry.assignee) {
        const doctor = doctors.find(
          (d) => d.name === enquiry.assignee?.name || d.employee_id === enquiry.assignee?.employee_id,
        );
        assigneeId = doctor?._id || '';
      }
      setFormData({
        status: enquiry.status,
        assignee: assigneeId,
        patient_gender: '',
      });
    }
  }, [enquiry, doctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry) return;

    if (!hasStoredGender(enquiry.patient_gender)) {
      const g = formData.patient_gender.trim();
      if (!g) {
        toast.error('Please select patient gender before saving.');
        return;
      }
    }

    setLoading(true);
    try {
      const updateData: Record<string, unknown> = {
        status: formData.status,
      };
      if (formData.assignee) {
        updateData.assignee = formData.assignee;
      }
      if (!hasStoredGender(enquiry.patient_gender) && formData.patient_gender.trim()) {
        updateData.patient_gender = formData.patient_gender.trim();
      }
      await adminApi.updateEnquiry(enquiry._id, updateData);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to update enquiry:', error);
      const msg = error instanceof Error ? error.message : 'Failed to update enquiry. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!enquiry) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={backdropTransition}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[6px]"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-enquiry-title"
        className="relative z-10 flex max-h-[min(92vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.28),0_0_0_1px_rgba(15,23,42,0.04)]"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={panelTransition}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative shrink-0 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 px-6 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-500/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/4 h-24 w-24 rounded-full bg-white/5 blur-xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-300/95">Enquiry</p>
              <h2 id="edit-enquiry-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Edit enquiry
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                Update status and assignment. Patient details are read-only unless gender was not stored - then you
                can set it once here.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/90 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={`${scrollBody} px-6 py-6 sm:px-7`}>
            <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-b from-slate-50/90 to-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700/10 text-teal-800">
                  <User className="h-4 w-4" strokeWidth={2} />
                </span>
                <h3 className="text-sm font-semibold text-slate-900">Patient information</h3>
              </div>
              <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                <InfoItem label="Name">{enquiry.patient_name}</InfoItem>
                <InfoItem label="Age">{enquiry.patient_age}</InfoItem>
                <InfoItem label="Mobile">{enquiry.patient_mob}</InfoItem>
                <InfoItem label="Service">{enquiry.service?.trim() ? enquiry.service : '-'}</InfoItem>
                {hasStoredGender(enquiry.patient_gender) ? (
                  <InfoItem label="Gender">{enquiry.patient_gender}</InfoItem>
                ) : (
                  <SelectWrap>
                  <select
                    id="patient_gender"
                    value={formData.patient_gender}
                    onChange={(e) => setFormData({ ...formData, patient_gender: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select gender…</option>
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
                )}
              </dl>
              <div className="mt-4 rounded-xl border border-slate-200/60 bg-white/80 p-4 ring-1 ring-slate-100/80">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {enquiry.message?.trim() ? enquiry.message : '-'}
                </p>
              </div>
            </section>

            <section className="mt-8 space-y-5">
              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-800">
                  Status <span className="text-red-600">*</span>
                </label>
                <SelectWrap>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'new' | 'viewed' | 'completed' })
                    }
                    className={selectClass}
                    required
                  >
                    <option value="new">New</option>
                    <option value="viewed">Viewed</option>
                    <option value="completed">Completed</option>
                  </select>
                </SelectWrap>
              </div>

              <div>
                <label htmlFor="assignee" className="mb-2 block text-sm font-medium text-slate-800">
                  Assign to doctor
                </label>
                <SelectWrap>
                  <select
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Unassigned</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} ({doctor.employee_id})
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </div>
            </section>
          </div>

          <div className="shrink-0 border-t border-slate-200/80 bg-slate-50/95 px-6 py-4 sm:px-7">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-teal-600 to-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 ring-1 ring-teal-700/30 transition hover:from-teal-500 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating…
                  </>
                ) : (
                  'Update enquiry'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
