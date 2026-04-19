import type { ContentSummaryCounts, SiteSettingsBundle } from './site-content-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn(
    'NEXT_PUBLIC_API_URL is not set. Please add it to your .env.local file.\n' +
    'Example: NEXT_PUBLIC_API_URL=http://localhost:3001/api'
  );
}

const DEFAULT_API_URL = 'http://localhost:3001/api';
const BASE_URL = API_BASE_URL || DEFAULT_API_URL;

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      let msg: string;
      if (typeof error.message === 'string') {
        msg = error.message;
      } else if (Array.isArray(error.message)) {
        msg = error.message.map((m: unknown) => String(m)).join(', ');
      } else {
        msg = `HTTP error! status: ${response.status}`;
      }
      if (error.seconds_remaining != null) {
        msg = `${msg} Retry in ${error.seconds_remaining}s.`;
      }
      throw new Error(msg);
    }

    return response.json();
  }

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', signal });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(BASE_URL);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{
      access_token: string;
      user: { id: string; email: string; role: string; doctorId?: string | null };
    }>('/auth/login', { email, password }),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post<{
      access_token: string;
      user: { id: string; email: string; role: string; doctorId?: string | null };
    }>('/auth/reset-password', { email, otp, newPassword }),

  sendChangePasswordOtp: (oldPassword: string) =>
    api.post<{ message: string }>('/auth/send-change-password-otp', { oldPassword }),

  changePassword: (oldPassword: string, newPassword: string, otp: string) =>
    api.post<{ message: string }>('/auth/change-password', {
      oldPassword,
      newPassword,
      otp,
    }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
  
  setAuth: (token: string, user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
};

export interface SocialMediaItem {
  _id: string;
  title: string;
  href: string;
  icon_url?: string | null;
}

export const contentApi = {
  getSiteSettings: (signal?: AbortSignal) => api.get<SiteSettingsBundle>('/site-settings', signal),
  getSocialMedia: (signal?: AbortSignal) => api.get<SocialMediaItem[]>('/social-media', signal),
};

export const enquiriesApi = {
  create: (data: {
    patient_name: string;
    patient_age: number;
    patient_mob: string;
    patient_gender: string;
    message?: string;
    service: string;
    mode_of_conversation: string;
    speciality?: string;
  }) => api.post('/enquiries', data),
};

export const adminApi = {
  getDashboard: (signal?: AbortSignal) => api.get('/admin/dashboard', signal),
  getEnquiries: (page = 1, limit = 30, status?: string, assignee?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    if (assignee) params.append('assignee', assignee);
    return api.get(`/enquiries?${params.toString()}`);
  },
  getAllEnquiries: (status?: string, assignee?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (assignee) params.append('assignee', assignee);
    const queryString = params.toString();
    return api.get(`/enquiries/export/all${queryString ? `?${queryString}` : ''}`);
  },
  updateEnquiry: (id: string, data: any) => api.patch(`/enquiries/${id}`, data),
  deleteEnquiry: (id: string) => api.delete(`/enquiries/${id}`),
  bulkDeleteEnquiries: (ids: string[]) => api.post('/enquiries/bulk-delete', { ids }),
  getDoctors: (page = 1, limit = 30) => api.get(`/doctors?page=${page}&limit=${limit}`),
  getAllDoctors: () => api.get('/doctors/export/all'),
  getPatients: (page = 1, limit = 30) => api.get(`/patients?page=${page}&limit=${limit}`),
  getAllPatients: () => api.get('/patients/export/all'),
  deletePatient: (id: string) => api.delete(`/patients/${id}`),
  bulkDeletePatients: (ids: string[]) => api.post('/patients/bulk-delete', { ids }),
  createDoctor: (data: any) => api.post('/doctors', data),
  createDoctorsBulk: (doctors: any[]) => api.post('/doctors/bulk', { doctors }),
  updateDoctor: (id: string, data: any) => api.patch(`/doctors/${id}`, data),
  deleteDoctor: (id: string) => api.delete(`/doctors/${id}`),
  bulkDeleteDoctors: (ids: string[]) => api.post('/doctors/bulk-delete', { ids }),
  getServices: () => api.get('/services'),
  getServiceById: (id: string) => api.get(`/services/${id}`),
  createService: (data: any) => api.post('/services', data),
  updateService: (id: string, data: any) => api.patch(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
  getSocialMedia: () => api.get('/social-media'),
  createSocialMedia: (data: any) => api.post('/social-media', data),
  updateSocialMedia: (id: string, data: any) => api.patch(`/social-media/${id}`, data),
  deleteSocialMedia: (id: string) => api.delete(`/social-media/${id}`),
  getSiteSettingsAdmin: () => api.get<SiteSettingsBundle>('/site-settings/admin'),
  updateSiteSettings: (data: Record<string, unknown>) => api.patch<SiteSettingsBundle>('/site-settings', data),
  getContentSummary: () => api.get<ContentSummaryCounts>('/admin/content/summary'),
  getHeroDiscount: () => api.get<{ discount: number; isActive: boolean }>('/hero-discount'),
  updateHeroDiscount: (data: { discount?: number; isActive?: boolean }) =>
    api.patch('/hero-discount', data),
  getCoreValues: () => api.get('/core-values'),
  getLeadershipTeam: () => api.get('/leadership-team'),
};

export const doctorApi = {
  getMyEnquiries: (page = 1, limit = 30) => api.get(`/doctors/my-enquiries?page=${page}&limit=${limit}`),
  getMyProfile: () => api.get('/doctors/me/profile'),
  updateMyProfile: (data: any) => api.patch('/doctors/me/profile', data),
  updateMyAvailability: (availability: any[]) => api.patch('/doctors/me/availability', { availability }),
  updateEnquiryStatus: (id: string, status: string) => api.patch(`/enquiries/${id}`, { status }),
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/doctors/me/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }
    
    return response.json();
  },
};
