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

type ApiResponse<T> = {
  code?: number;
  message?: string;
  result?: T;
};

function unwrapResult<T>(payload: T | ApiResponse<T>) {
  if (payload && typeof payload === 'object') {
    const result = payload as ApiResponse<T>;
    if (result.result !== undefined) {
      return result.result;
    }
  }

  return payload as T;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse> | LoginResponse>('/auth/login', {
      username,
      password,
    });

    const payload = unwrapResult(response);
    if (!payload?.token) {
      throw new Error('Invalid credentials');
    }

    return payload;
  },

  register: async (data: RegisterDTO) => {
    const response = await axiosInstance.post<ApiResponse<unknown> | unknown>('/auth/register', data);
    return unwrapResult(response);
  },

  refresh: async (token: string) => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse> | LoginResponse>('/auth/refresh', { token });
    return unwrapResult(response);
  },

  logout: async (token: string) => {
    const response = await axiosInstance.post<ApiResponse<unknown> | unknown>('/auth/logout', { token });
    return unwrapResult(response);
  },

  introspect: async (token: string) => {
    const response = await axiosInstance.post<ApiResponse<{ valid: boolean }> | { valid: boolean }>('/auth/introspect', { token });
    return unwrapResult(response);
  },
};
