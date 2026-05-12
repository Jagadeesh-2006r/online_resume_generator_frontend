import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://online-resume-generator-backend.onrender.com/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/auth/reset-password/${token}`, { password });

// User
export const updateProfile = (data) => API.put('/users/profile', data);
export const uploadAvatar = (formData) => API.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getUserBadges = () => API.get('/users/badges');

// Resumes
export const getResumes = () => API.get('/resumes');
export const getResume = (id) => API.get(`/resumes/${id}`);
export const createResume = (data) => API.post('/resumes', data);
export const updateResume = (id, data) => API.put(`/resumes/${id}`, data);
export const deleteResume = (id) => API.delete(`/resumes/${id}`);
export const duplicateResume = (id) => API.post(`/resumes/${id}/duplicate`);
export const getPublicResume = (token) => API.get(`/resumes/public/${token}`);
export const generateQRCode = (id) => API.get(`/resumes/${id}/qrcode`);
export const getATSScore = (id) => API.get(`/resumes/${id}/ats`);
export const trackDownload = (id) => API.post(`/resumes/${id}/download`);
export const saveVersion = (id) => API.post(`/resumes/${id}/versions`);
export const getVersions = (id) => API.get(`/resumes/${id}/versions`);
export const restoreVersion = (id, versionId) => API.post(`/resumes/${id}/versions/${versionId}/restore`);

// Templates
export const getTemplates = () => API.get('/templates');

// Analytics
export const getMyAnalytics = () => API.get('/analytics/me');
export const getAdminStats = () => API.get('/analytics/admin/stats');
export const getAdminUsers = (params) => API.get('/analytics/admin/users', { params });
export const toggleUser = (id) => API.put(`/analytics/admin/users/${id}/toggle`);
export const adminDeleteResume = (id) => API.delete(`/analytics/admin/resumes/${id}`);

// AI
export const generateSummary = (data) => API.post('/ai/summary', data);
export const generateSkillSuggestions = (data) => API.post('/ai/skills', data);
export const generateInterviewQuestions = (data) => API.post('/ai/interview-questions', data);
export const generateProjectDescription = (data) => API.post('/ai/project-description', data);

export default API;
