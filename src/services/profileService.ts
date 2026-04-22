import api from '@/lib/api';
import fileService from './fileService';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  dob?: string;
  status?: string;
  roleName?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
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
    const response: any = await api.get<ApiResponse<UserProfile> | UserProfile>('/users/my-info');
    const baseInfo = unwrapResult(response);
    
    // Merge with tutor info to get headline and bio if they exist
    try {
      const tutorResponse: any = await api.get<ApiResponse<any>>('/api/tutor-profiles/my-profile');
      const tutorInfo = unwrapResult(tutorResponse);
      return { 
        ...baseInfo, 
        headline: tutorInfo?.headline || baseInfo?.headline, 
        bio: tutorInfo?.bio || baseInfo?.bio, 
        avatarUrl: baseInfo?.avatarUrl || tutorInfo?.avatarUrl // Prioritize User avatarUrl
      } as UserProfile;
    } catch (e) {
      return baseInfo as UserProfile;
    }
  },

  getTutorProfile: async () => {
    const response: any = await api.get<ApiResponse<unknown> | unknown>('/api/tutor-profiles/my-profile');
    return unwrapResult(response);
  },

  updateProfile: async (payload: { fullName?: string; headline?: string; bio?: string }) => {
    const promises = [];
    
    if (payload.headline || payload.bio) {
      promises.push(api.put('/api/tutor-profiles/me', {
        headline: payload.headline,
        bio: payload.bio
      }));
    }
    
    if (payload.fullName) {
      promises.push(api.put('/users/me', {
        fullName: payload.fullName
      }));
    }
    
    const results = await Promise.all(promises);
    return results[0] ? unwrapResult(results[0] as any) : null;
  },

  updateTutorProfile: async (payload: { headline?: string; bio?: string; videoIntroduction?: string }) => {
    const response: any = await api.put<ApiResponse<unknown> | unknown>('/api/tutor-profiles/me', payload);
    return unwrapResult(response);
  },

  updateAvatar: async (file: File): Promise<string> => {
    try {
      // Step 1: Get presigned URL for public storage (VIDEO bucket)
      const { uploadUrl, fileUrl } = await fileService.getPresignedUrl(file.name, file.type, "VIDEO");
      
      // Step 2: Upload to S3
      await fileService.uploadFileToS3(uploadUrl, file);
      
      // Step 3: Update backend with the new file URL
      await api.patch('/users/avatar', { avatarUrl: fileUrl });
      
      return fileUrl;
    } catch (error) {
      console.error("Failed to upload avatar", error);
      throw error;
    }
  },

  createTutorProfile: async (payload: { headline: string; bio: string; videoIntroduction?: string }) => {
    const response: any = await api.post<ApiResponse<unknown> | unknown>('/api/tutor-profiles', payload);
    return unwrapResult(response);
  },
};
