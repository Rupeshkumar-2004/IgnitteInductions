import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  getCurrentUser: () => api.get('/users/me'),
};

// Application APIs
export const applicationAPI = {
  submit: (data) => api.post('/applications/submit', data),
  getMyApplication: () => api.get('/applications/me'),
  submitTask: (taskId, link) => api.post(`/applications/tasks/${taskId}`, { submission: link }),
};

// Admin APIs
export const adminAPI = {
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  getApplicationById: (id) => api.get(`/admin/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/admin/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/admin/applications/${id}`),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  assignTask: (id, data) => api.post(`/admin/applications/${id}/task`, data),
  createTeamMember: (data) => api.post('/admin/team/create', data),
  verifyTask: (appId, taskId, data) => api.patch(`/admin/applications/${appId}/tasks/${taskId}`, data),
};

export default api;