import axios from 'axios';

// Get API URL from env, fallback to localhost if not found
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

// Interceptor for Requests: Inject Authorization Header
axiosInstance.interceptors.request.use(
  (config) => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for Responses: Handle global errors (e.g. 401)
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Maintain compatibility: services expect response.data
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Pre-emptively redirect if we are in a protected route
        if (window.location.pathname.startsWith('/tutor/dashboard')) {
          window.location.href = '/login?error=session_expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
