'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/api';

interface Enquiry {
  _id: string;
  patient_name: string;
  patient_age: number;
  patient_mob: string;
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

export default function EditEnquiryModal({
  enquiry,
  doctors,
  onClose,
  onSuccess,
}: EditEnquiryModalProps) {
  const [formData, setFormData] = useState({
    status: 'new' as 'new' | 'viewed' | 'completed',
    assignee: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enquiry) {
      let assigneeId = '';
      if (enquiry.assignee) {
        const doctor = doctors.find(
          (d) => d.name === enquiry.assignee?.name || d.employee_id === enquiry.assignee?.employee_id
        );
        assigneeId = doctor?._id || '';
      }
      setFormData({
        status: enquiry.status,
        assignee: assigneeId,
      });
    }
  }, [enquiry, doctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry) return;

    setLoading(true);
    try {
      const updateData: any = {
        status: formData.status,
      };
      if (formData.assignee) {
        updateData.assignee = formData.assignee;
      }
      await adminApi.updateEnquiry(enquiry._id, updateData);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to update enquiry:', error);
      alert(error.message || 'Failed to update enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!enquiry) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">Edit Enquiry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="text-gray-900 font-medium">{enquiry.patient_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Age</label>
                <p className="text-gray-900 font-medium">{enquiry.patient_age}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Mobile</label>
                <p className="text-gray-900 font-medium">{enquiry.patient_mob}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Service</label>
                <p className="text-gray-900 font-medium">{enquiry.service}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Message</label>
              <p className="text-gray-900">{enquiry.message || '-'}</p>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition-colors"
              required
            >
              <option value="new">New</option>
              <option value="viewed">Viewed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Doctor
            </label>
            <select
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition-colors"
            >
              <option value="">Unassigned</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} ({doctor.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
