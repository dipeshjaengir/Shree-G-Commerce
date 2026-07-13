import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Auto-resolve to production Render API if running on Vercel deployment
    if (hostname.includes('vercel.app') || hostname.includes('shree-g-commerce')) {
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'https://shree-g-commerce.onrender.com/api';
      }
    }
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${window.location.origin}/api`;
    }
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to format errors uniformly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {
      success: false,
      message: 'Network error. Please try again later.'
    };
    return Promise.reject(errorData);
  }
);

export default api;
