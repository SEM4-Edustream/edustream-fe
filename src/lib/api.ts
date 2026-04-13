// Re-export the main axios instance for backward compatibility.
// All modules should eventually import from '@/lib/axios' directly.
import axiosInstance from './axios';
export default axiosInstance;
