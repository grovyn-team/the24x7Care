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
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
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
    api.post<{ access_token: string; user: { id: string; email: string; role: string } }>('/auth/login', { email, password }),
  
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

export const enquiriesApi = {
  create: (data: {
    patient_name: string;
    patient_age: number;
    patient_mob: string;
    message: string;
  }) => api.post('/enquiries', data),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
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
  getDoctors: (page = 1, limit = 30) => api.get(`/doctors?page=${page}&limit=${limit}`),
  getAllDoctors: () => api.get('/doctors/export/all'),
  getPatients: (page = 1, limit = 30) => api.get(`/patients?page=${page}&limit=${limit}`),
  getAllPatients: () => api.get('/patients/export/all'),
  createDoctor: (data: any) => api.post('/doctors', data),
  updateDoctor: (id: string, data: any) => api.patch(`/doctors/${id}`, data),
  deleteDoctor: (id: string) => api.delete(`/doctors/${id}`),
  getServices: () => api.get('/services'),
  createService: (data: any) => api.post('/services', data),
  updateService: (id: string, data: any) => api.patch(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
  getSocialMedia: () => api.get('/social-media'),
  createSocialMedia: (data: any) => api.post('/social-media', data),
  updateSocialMedia: (id: string, data: any) => api.patch(`/social-media/${id}`, data),
  deleteSocialMedia: (id: string) => api.delete(`/social-media/${id}`),
};
