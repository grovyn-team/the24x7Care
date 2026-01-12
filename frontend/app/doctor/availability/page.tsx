'use client';

import { useEffect, useState } from 'react';
import { doctorApi } from '../../lib/api';

interface DayAvailability {
  day: string;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export default function DoctorAvailabilityPage() {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const profile = await doctorApi.getMyProfile() as any;
        if (profile.availability && profile.availability.length > 0) {
          setAvailability(profile.availability);
        } else {
          setAvailability(
            DAYS_OF_WEEK.map((day) => ({
              day: day.value,
              startTime: null,
              endTime: null,
              isAvailable: false,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        setAvailability(
          DAYS_OF_WEEK.map((day) => ({
            day: day.value,
            startTime: null,
            endTime: null,
            isAvailable: false,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const updateDay = (dayValue: string, updates: Partial<DayAvailability>) => {
    setAvailability((prev) =>
      prev.map((day) => (day.day === dayValue ? { ...day, ...updates } : day))
    );
  };

  const handleApplyToAll = () => {
    const firstAvailable = availability.find((day) => day.isAvailable);
    if (firstAvailable) {
      setAvailability((prev) =>
        prev.map((day) => ({
          ...day,
          isAvailable: firstAvailable.isAvailable,
          startTime: firstAvailable.startTime,
          endTime: firstAvailable.endTime,
        }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorApi.updateMyAvailability(availability);
      setSuccessMessage('Availability updated successfully!');
    } catch (error: any) {
      console.error('Failed to update availability:', error);
      alert(error.message || 'Failed to update availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  const fullAvailability = DAYS_OF_WEEK.map((dayOption) => {
    const existing = availability.find((a) => a.day === dayOption.value);
    return (
      existing || {
        day: dayOption.value,
        startTime: null,
        endTime: null,
        isAvailable: false,
      }
    );
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Success Message Popup */}
      {successMessage && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Availability</h1>
        <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your weekly availability schedule</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {fullAvailability.map((day) => {
              const dayOption = DAYS_OF_WEEK.find((d) => d.value === day.day);
              return (
                <div
                  key={day.day}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`available-${day.day}`}
                        checked={day.isAvailable}
                        onChange={(e) =>
                          updateDay(day.day, { isAvailable: e.target.checked })
                        }
                        className="w-5 h-5 text-teal-700 border-gray-300 rounded focus:ring-teal-700"
                      />
                      <label
                        htmlFor={`available-${day.day}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {dayOption?.label}
                      </label>
                    </div>
                  </div>

                  {day.isAvailable && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
                      <div>
                        <label
                          htmlFor={`start-${day.day}`}
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Start Time
                        </label>
                        <input
                          id={`start-${day.day}`}
                          type="time"
                          value={day.startTime || ''}
                          onChange={(e) =>
                            updateDay(day.day, { startTime: e.target.value || null })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`end-${day.day}`}
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          End Time
                        </label>
                        <input
                          id={`end-${day.day}`}
                          type="time"
                          value={day.endTime || ''}
                          onChange={(e) =>
                            updateDay(day.day, { endTime: e.target.value || null })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleApplyToAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Apply First Day's Schedule to All
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
