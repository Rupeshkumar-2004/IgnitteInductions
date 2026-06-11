//this file is used to make the api requests to the backend
import axios from 'axios';

//this is the base url of the backend
const API_BASE_URL = 'http://localhost:5000/api/v1';

//axios is a promise based http client for the browser and node.js
const api = axios.create({
  baseURL: API_BASE_URL,
  //withCredentials is used to send the cookies to the server
  withCredentials: true,
  //headers are used to send the token to the server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
// interceptor is a function which will intercept the request before sending it to the server
// so that we can add the token to the request
// config is the configuration object which will be sent to the server example:
// {
//   url: '/users/me',
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   data: null,
//   params: null,
// }
//this is the interceptor function which will intercept the request before sending it to the server
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  //adds the access token to the request
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  //post request to the register endpoint
  register: (data) => api.post('/users/register', data),
  //post request to the login endpoint
  login: (data) => api.post('/users/login', data),
  //post request to the logout endpoint
  logout: () => api.post('/users/logout'),
  //get request to the me endpoint
  getCurrentUser: () => api.get('/users/me'),
};

// Application APIs
export const applicationAPI = {
  //post request to the submit endpoint
  submit: (data) => api.post('/applications/submit', data),
  //get request to the me endpoint
  getMyApplication: () => api.get('/applications/me'),
  //post request to the tasks endpoint
  submitTask: (taskId, link) => api.post(`/applications/tasks/${taskId}`, { submission: link }),
};

// Admin APIs
export const adminAPI = {
  //get all applications
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  //get application by id
  getApplicationById: (id) => api.get(`/admin/applications/${id}`),
  //update status
  updateStatus: (id, data) => api.patch(`/admin/applications/${id}`, data),
  //delete application
  deleteApplication: (id) => api.delete(`/admin/applications/${id}`),
  //get dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  //post request to the task endpoint
  assignTask: (id, data) => api.post(`/admin/applications/${id}/task`, data),
  //post request to the team endpoint
  createTeamMember: (data) => api.post('/admin/team/create', data),
  //get request to the team endpoint
  getTeamMembers: () => api.get('/admin/team'),
  //delete request to the team endpoint
  removeTeamMember: (id) => api.delete(`/admin/team/${id}`),
  //patch request to the task endpoint
  verifyTask: (appId, taskId, data) => api.patch(`/admin/applications/${appId}/tasks/${taskId}`, data),
};

export default api;