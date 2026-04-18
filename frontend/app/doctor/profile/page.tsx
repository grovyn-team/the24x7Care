'use client';

import { useEffect, useState, useRef } from 'react';
import { Check, ImageIcon, Plus, X } from 'lucide-react';
import { doctorApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  mobile: string;
  employee_id: string;
  gender: 'male' | 'female';
  avatar_url?: string;
}

export default function DoctorProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    mobile: '',
    gender: 'male' as 'male' | 'female',
    avatar_url: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await doctorApi.getMyProfile() as Doctor;
        setProfile(data);
        setFormData({
          name: data.name || '',
          specialization: data.specialization || '',
          mobile: data.mobile || '',
          gender: data.gender || 'male',
          avatar_url: data.avatar_url || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.warning('Please choose an image file (PNG, JPG, etc.).');
      return;
    }

    setUploading(true);
    try {
      const result = await doctorApi.uploadAvatar(file);
      setFormData({ ...formData, avatar_url: result.url });
      setSuccessMessage('Avatar uploaded successfully!');
      setShowUploadModal(false);
      const updated = await doctorApi.getMyProfile() as Doctor;
      setProfile(updated);
    } catch (error: any) {
      console.error('Failed to upload avatar:', error);
      toast.error(error.message || 'Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData: any = { ...formData };
      if (!updateData.avatar_url) {
        delete updateData.avatar_url;
      }
      await doctorApi.updateMyProfile(updateData);
      const updated = await doctorApi.getMyProfile() as Doctor;
      setProfile(updated);
      setSuccessMessage('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
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

  return (
    <div className="space-y-4 lg:space-y-6">
      {successMessage && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in">
          <Check className="h-6 w-6" strokeWidth={2} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your profile information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar Image
            </label>
            {formData.avatar_url ? (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="relative group"
                >
                  <img
                    src={formData.avatar_url}
                    alt="Avatar"
                    className="h-24 w-24 lg:h-32 lg:w-32 rounded-full object-cover border-4 border-gray-200 cursor-pointer hover:border-teal-500 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar_url: '' })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center h-24 w-24 lg:h-32 lg:w-32 rounded-full border-4 border-dashed border-gray-300 hover:border-teal-500 transition-colors cursor-pointer"
              >
                <Plus className="h-12 w-12 text-gray-400 lg:h-16 lg:w-16" strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <input
                id="specialization"
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">10 digits only</p>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-900">Upload Avatar</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-teal-700 bg-teal-50'
                    : 'border-gray-300 hover:border-teal-500'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop an image here, or click to browse
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
