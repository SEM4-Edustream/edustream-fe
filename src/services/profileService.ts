import api from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get("/api/profile/me");
    return {
      id: data.id || "",
      name: data.fullName || "",
      bio: data.bio || "",
      avatarUrl: data.avatarUrl || "",
      createdAt: data.createdAt || "",
    };
  },

  updateProfile: async (name: string, bio: string) => {
    return await api.put("/api/profile/me", { fullName: name, bio });
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.put("/api/profile/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.avatar_url || data.avatarUrl;
  }
};
