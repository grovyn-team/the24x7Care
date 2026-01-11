'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { enquiriesApi } from '../../lib/api';

interface ConsultationFormProps {
  onClose?: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_mobile: '',
    patient_message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        message: formData.patient_message.trim(),
      };

      await enquiriesApi.create(enquiryData);
      
      setFormData({
        patient_name: '',
        patient_age: '',
        patient_mobile: '',
        patient_message: '',
      });
      
      setSubmitSuccess(true);
      
      if (onClose) {
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error?.message || 'There was an error submitting your request. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const isFormValid = () => {
    return (
      formData.patient_name.trim() !== '' &&
      formData.patient_age.trim() !== '' &&
      parseInt(formData.patient_age) > 0 &&
      parseInt(formData.patient_age) < 100 &&
      formData.patient_mobile.trim() !== '' &&
      validateMobile(formData.patient_mobile) &&
      formData.patient_message.trim() !== '' &&
      formData.patient_message.length <= 200
    );
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Consultation Booked Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your consultation request has been submitted. Our team will contact you soon via telephone to confirm the details.
        </p>
        <p className="text-sm text-gray-500">
          You will receive a payment receipt after confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700 mb-2">
          Patient Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="patient_name"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition-colors"
          placeholder="Enter patient's full name"
        />
      </div>

      <div>
        <label htmlFor="patient_age" className="block text-sm font-medium text-gray-700 mb-2">
          Patient Age <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="patient_age"
          name="patient_age"
          value={formData.patient_age}
          onChange={handleChange}
          required
          min="1"
          max="99"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition-colors"
          placeholder="Enter age (1-99)"
        />
        {formData.patient_age && (parseInt(formData.patient_age) < 1 || parseInt(formData.patient_age) >= 100) && (
          <p className="mt-1 text-sm text-red-600">Age must be between 1 and 99</p>
        )}
      </div>

      <div>
        <label htmlFor="patient_mobile" className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number <span className="text-red-500">*</span>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition-colors"
          placeholder="10 digit mobile number"
        />
        {formData.patient_mobile && !validateMobile(formData.patient_mobile) && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid 10-digit mobile number</p>
        )}
      </div>

      <div>
        <label htmlFor="patient_message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
          <span className="text-gray-500 font-normal ml-2">
            ({formData.patient_message.length}/200 characters)
          </span>
        </label>
        <textarea
          id="patient_message"
          name="patient_message"
          value={formData.patient_message}
          onChange={handleChange}
          required
          maxLength={200}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition-colors resize-none"
          placeholder="Brief description of your needs or concerns..."
        />
        {formData.patient_message.length >= 200 && (
          <p className="mt-1 text-sm text-red-600">Maximum 200 characters allowed</p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Book Consultation'}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to be contacted by our team via telephone for consultation confirmation.
      </p>
    </form>
  );
};
