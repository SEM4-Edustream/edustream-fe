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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor for Responses: Handle global errors (e.g. 401)
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Maintain compatibility: services expect response.data
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If we are already refreshing, queue the request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!currentToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Call refresh API directly with a clean axios call to avoid circular dependency
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          token: currentToken,
        });

        const newToken = response.data?.result?.token || response.data?.token;

        if (newToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', newToken);
          }
          
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Refresh failed - no token returned');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Pre-emptively redirect if we are in a protected route
    if (window.location.pathname.startsWith('/tutor/dashboard')) {
      window.location.href = '/login?error=session_expired';
    }
  }
}

export default axiosInstance;
