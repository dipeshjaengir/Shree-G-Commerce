import axios from 'axios';

const getBaseURL = () => {
  let url = '';
  
  if (import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  } else if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Auto-resolve to production Render API if running on Vercel deployment
    if (hostname.includes('vercel.app') || hostname.includes('shree-g-commerce')) {
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        url = 'https://shree-g-commerce.onrender.com/api/v1';
      }
    }
    if (!url && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      url = `${window.location.origin}/api/v1`;
    }
  }
  
  if (!url) {
    url = 'http://localhost:5000/api/v1';
  }

  // Sanitize trailing slashes and verify/append /api/v1 or /api prefix
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api/v1') && !url.endsWith('/api')) {
    url = `${url}/api/v1`;
  }
  
  return url;
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
