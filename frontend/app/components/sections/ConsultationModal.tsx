'use client';

import { X } from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';

export const CONSULTATION_MODAL_PANEL_CLASS =
  'bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-gray-900/[0.06] border border-white/60';

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-gray-100/90 bg-white/95 px-6 pb-5 pt-6 backdrop-blur-md sm:px-10 sm:pb-6 sm:pt-8">
      <div className="min-w-0 pr-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">The24x7Care</p>
        <h2 id="consultation-modal-title" className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-[1.65rem]">
          Schedule a Consultation
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          Share a few details and our care team will reach out by phone to confirm your booking.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 rounded-full border border-gray-200/90 bg-white p-2.5 text-gray-400 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}

export function ConsultationModalPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalHeader onClose={onClose} />
      <div className="px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
        <ConsultationForm onClose={onClose} />
      </div>
    </>
  );
}

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConsultationModal({ open, onClose }: ConsultationModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/45 to-teal-950/40 backdrop-blur-[10px]"
        aria-hidden
        onClick={onClose}
      />
      <div
        className={`relative z-10 ${CONSULTATION_MODAL_PANEL_CLASS}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <ConsultationModalPanel onClose={onClose} />
      </div>
    </div>
  );
}
