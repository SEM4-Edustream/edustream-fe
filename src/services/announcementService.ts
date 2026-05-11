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
  getCourseAnnouncements: async (courseId: string) => {
    const res = await api.get<any>(`/api/courses/${courseId}/announcements`);
    return res || [];
  },

  createAnnouncement: async (courseId: string, data: AnnouncementRequest) => {
    const res = await api.post<any>(`/api/courses/${courseId}/announcements`, data);
    return res;
  }
};
