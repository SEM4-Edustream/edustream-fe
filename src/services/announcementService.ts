import api from "@/lib/api";

export interface AnnouncementResponse {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface AnnouncementRequest {
  title: string;
  content: string;
}

export const announcementService = {
  getCourseAnnouncements: async (courseId: string): Promise<AnnouncementResponse[]> => {
    return await api.get<any>(`/api/courses/${courseId}/announcements`) as any;
  },

  createAnnouncement: async (courseId: string, data: AnnouncementRequest): Promise<any> => {
    return await api.post<any>(`/api/courses/${courseId}/announcements`, data) as any;
  }
};
