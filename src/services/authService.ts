import axiosInstance from '@/lib/axios';

export interface LoginResponse {
  token: string;
  authenticated?: boolean;
}

export interface RegisterDTO {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const payload: any = await axiosInstance.post<LoginResponse>('/auth/login', {
      username,
      password,
    });

    if (!payload?.token) {
      throw new Error('Invalid credentials');
    }

    return payload;
  },

  register: async (data: RegisterDTO) => {
    return await axiosInstance.post<unknown>('/auth/register', data);
  },

  refresh: async (token: string) => {
    return await axiosInstance.post<LoginResponse>('/auth/refresh', { token });
  },

  logout: async (token: string) => {
    return await axiosInstance.post<unknown>('/auth/logout', { token });
  },

  introspect: async (token: string) => {
    return await axiosInstance.post<{ valid: boolean }>('/auth/introspect', { token });
  },

  forgotPassword: async (email: string) => {
    return await axiosInstance.post<void>('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return await axiosInstance.post<void>('/auth/reset-password', { token, newPassword });
  },
};
