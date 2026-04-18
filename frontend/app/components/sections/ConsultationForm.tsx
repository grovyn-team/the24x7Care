'use client';

import React, { useState } from 'react';
import { Check, MessageCircle, Phone, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { enquiriesApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface ConsultationFormProps {
  onClose?: () => void;
}

const SERVICE_OPTIONS = [
  'Medical Equipment on rent',
  'ICU and Ventilation Setup',
  'Home Care',
  'Doctor Consultation',
  'Second Opinion',
] as const;

const MODE_OPTIONS = ['Audio Call', 'Video Call', 'Chat'] as const;

const SPECIALITY_OPTIONS = [
  'Dermatologist',
  'Pulmonologist',
  'Nephrologist',
  'Dentologist',
] as const;

const GENDER_OPTIONS = ['Male', 'Female', 'Others'] as const;

const inputClass =
  'w-full rounded-xl border border-gray-200/90 bg-white px-4 py-3.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/[0.12] focus:shadow-md';

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500';

const sectionShell =
  'rounded-2xl border border-gray-100/90 bg-gradient-to-br from-slate-50/90 via-white to-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-7';

function ModeIcon({ mode }: { mode: (typeof MODE_OPTIONS)[number] }) {
  const common = 'h-4 w-4';
  if (mode === 'Audio Call') {
    return <Phone className={common} aria-hidden strokeWidth={1.75} />;
  }
  if (mode === 'Video Call') {
    return <Video className={common} aria-hidden strokeWidth={1.75} />;
  }
  return <MessageCircle className={common} aria-hidden strokeWidth={1.75} />;
}

const MODE_HINTS: Record<(typeof MODE_OPTIONS)[number], string> = {
  'Audio Call': 'Voice-only consult',
  'Video Call': 'Face-to-face with care staff',
  Chat: 'Message-based follow-up',
};

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ onClose }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_mobile: '',
    patient_message: '',
    service: '',
    mode_of_conversation: '',
    speciality: '',
    patient_gender: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'service' && value !== 'Doctor Consultation' ? { speciality: '' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const enquiryData = {
        patient_name: formData.patient_name.trim(),
        patient_age: parseInt(formData.patient_age),
        patient_mob: formData.patient_mobile.trim(),
        patient_gender: formData.patient_gender,
        message: formData.patient_message.trim() || undefined,
        service: formData.service,
        mode_of_conversation: formData.mode_of_conversation,
        ...(formData.service === 'Doctor Consultation' && formData.speciality
          ? { speciality: formData.speciality }
          : {}),
      };

      await enquiriesApi.create(enquiryData);

      toast.success('Your consultation request was sent. We will contact you soon.');

      setFormData({
        patient_name: '',
        patient_age: '',
        patient_mobile: '',
        patient_message: '',
        service: '',
        mode_of_conversation: '',
        speciality: '',
        patient_gender: '',
      });

      setSubmitSuccess(true);

      if (onClose) {
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'There was an error submitting your request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const isFormValid = () => {
    const baseValid =
      formData.patient_name.trim() !== '' &&
      formData.patient_age.trim() !== '' &&
      parseInt(formData.patient_age) > 0 &&
      parseInt(formData.patient_age) < 100 &&
      formData.patient_mobile.trim() !== '' &&
      validateMobile(formData.patient_mobile) &&
      formData.service !== '' &&
      formData.mode_of_conversation !== '' &&
      formData.patient_gender !== '' &&
      (!formData.patient_message || formData.patient_message.length <= 200);

    if (formData.service === 'Doctor Consultation') {
      return baseValid && formData.speciality !== '';
    }

    return baseValid;
  };

  if (submitSuccess) {
    return (
      <div className="px-2 py-10 text-center sm:py-14">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-900/25 ring-4 ring-teal-100/90">
          <Check className="h-10 w-10 text-white" aria-hidden strokeWidth={2.25} />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-gray-900">Consultation booked</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
          Your request is in. Our team will contact you soon by telephone to confirm the details.
        </p>
        <p className="mt-4 text-xs text-gray-500">You will receive a payment receipt after confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className={sectionShell}>
        <h3 className="text-sm font-semibold text-gray-900">Patient details</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          We use this to prepare your consultation and reach you quickly.
        </p>
        <div className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="patient_name" className={labelClass}>
                Patient name <span className="font-normal normal-case tracking-normal text-red-500">*</span>
              </label>
              <input
                type="text"
                id="patient_name"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Full name as on records"
              />
            </div>
            <div>
              <label htmlFor="patient_age" className={labelClass}>
                Age <span className="font-normal normal-case tracking-normal text-red-500">*</span>
              </label>
              <input
                type="number"
                id="patient_age"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleChange}
                required
                min={1}
                max={99}
                className={inputClass}
                placeholder="1–99"
              />
              {formData.patient_age && (parseInt(formData.patient_age) < 1 || parseInt(formData.patient_age) >= 100) && (
                <p className="mt-1.5 text-xs text-red-600">Age must be between 1 and 99</p>
              )}
            </div>
            <div>
              <label htmlFor="patient_mobile" className={labelClass}>
                Mobile <span className="font-normal normal-case tracking-normal text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="patient_mobile"
                name="patient_mobile"
                value={formData.patient_mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
                className={inputClass}
                placeholder="10-digit number"
              />
              {formData.patient_mobile && !validateMobile(formData.patient_mobile) && (
                <p className="mt-1.5 text-xs text-red-600">Enter a valid 10-digit mobile number</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="patient_gender" className={labelClass}>
              Gender <span className="font-normal normal-case tracking-normal text-red-500">*</span>
            </label>
            <select
              id="patient_gender"
              name="patient_gender"
              value={formData.patient_gender}
              onChange={handleChange}
              required
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select gender…</option>
              {GENDER_OPTIONS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={sectionShell}>
        <h3 className="text-sm font-semibold text-gray-900">Care request</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">Tell us what service you need.</p>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="service" className={labelClass}>
              Service <span className="font-normal normal-case tracking-normal text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Choose a service…</option>
              {SERVICE_OPTIONS.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {formData.service === 'Doctor Consultation' && (
            <div>
              <label htmlFor="speciality" className={labelClass}>
                Speciality <span className="font-normal normal-case tracking-normal text-red-500">*</span>
              </label>
              <select
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required={formData.service === 'Doctor Consultation'}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select speciality…</option>
                {SPECIALITY_OPTIONS.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className={sectionShell}>
        <h3 className="text-sm font-semibold text-gray-900">How should we connect?</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          Preferred mode for your first conversation. <span className="text-red-500">*</span>
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2.5">
          {MODE_OPTIONS.map((mode) => {
            const selected = formData.mode_of_conversation === mode;
            return (
              <label
                key={mode}
                className={`relative flex cursor-pointer flex-row items-center gap-2.5 rounded-lg border-2 p-2.5 transition-all duration-200 sm:min-h-0 ${
                  selected
                    ? 'border-teal-600 bg-teal-50/90 shadow-sm shadow-teal-900/10 ring-1 ring-teal-600/15'
                    : 'border-gray-200/90 bg-white hover:border-gray-300 hover:bg-slate-50/80'
                }`}
              >
                <input
                  type="radio"
                  name="mode_of_conversation"
                  value={mode}
                  checked={selected}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    selected ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <ModeIcon mode={mode} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`block text-xs font-semibold leading-tight ${selected ? 'text-teal-900' : 'text-gray-900'}`}>
                    {mode}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-gray-500">{MODE_HINTS[mode]}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className={sectionShell}>
        <label htmlFor="patient_message" className={labelClass}>
          Message{' '}
          <span className="font-normal normal-case tracking-normal text-gray-400">
            ({formData.patient_message.length}/200)
          </span>
        </label>
        <textarea
          id="patient_message"
          name="patient_message"
          value={formData.patient_message}
          onChange={handleChange}
          maxLength={200}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Brief description of your needs or concerns…"
        />
        {formData.patient_message.length >= 200 && (
          <p className="mt-1.5 text-xs text-red-600">Maximum 200 characters</p>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="min-w-0 flex-1 rounded-lg border-2 py-2.5 text-sm font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="min-w-0 flex-1 rounded-lg py-2.5 text-sm font-medium shadow-md shadow-teal-900/15 transition-shadow hover:shadow-md hover:shadow-teal-900/20"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Book consultation'}
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/90 px-4 py-3.5">
        <p className="text-center text-[11px] leading-relaxed text-gray-500 sm:text-xs">
          By submitting this form, you agree to be contacted by our team via telephone for consultation confirmation.
        </p>
      </div>
    </form>
  );
};
