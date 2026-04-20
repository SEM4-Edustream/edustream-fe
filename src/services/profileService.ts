import api from '@/lib/api';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  dob?: string;
  status?: string;
  roleName?: string;
}

type ApiResponse<T> = {
  code?: number;
  message?: string;
  result?: T;
};

function unwrapResult<T>(payload: T | ApiResponse<T>) {
  if (payload && typeof payload === 'object' && 'result' in payload) {
    return (payload as ApiResponse<T>).result;
  }
  return payload as T;
}

export const profileService = {
  getProfile: async (): Promise<UserProfile | null> => {
    const response = await api.get<ApiResponse<UserProfile> | UserProfile>('/users/my-info');
    return unwrapResult(response) ?? null;
  },

  getTutorProfile: async () => {
    const response = await api.get<ApiResponse<unknown> | unknown>('/api/tutor-profiles/my-profile');
    return unwrapResult(response);
  },

  updateTutorProfile: async (payload: { headline?: string; bio?: string; videoIntroduction?: string }) => {
    const response = await api.put<ApiResponse<unknown> | unknown>('/api/tutor-profiles/me', payload);
    return unwrapResult(response);
  },

  createTutorProfile: async (payload: { headline: string; bio: string; videoIntroduction?: string }) => {
    const response = await api.post<ApiResponse<unknown> | unknown>('/api/tutor-profiles', payload);
    return unwrapResult(response);
  },
};
