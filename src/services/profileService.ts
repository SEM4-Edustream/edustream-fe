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


export const profileService = {
  getProfile: async (): Promise<UserProfile | null> => {
    const baseInfo = await api.get<UserProfile>('/users/my-info') as any;
    
    // Merge with tutor info to get headline and bio if they exist
    try {
      const tutorInfo = await api.get<any>('/api/tutor-profiles/my-profile') as any;
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
    return await api.get<unknown>('/api/tutor-profiles/my-profile') as any;
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
    return results[0] as any;
  },

  updateTutorProfile: async (payload: { headline?: string; bio?: string; videoIntroduction?: string }) => {
    return await api.put<unknown>('/api/tutor-profiles/me', payload) as any;
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
    return await api.post<unknown>('/api/tutor-profiles', payload) as any;
  },
};
