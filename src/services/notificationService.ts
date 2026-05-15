import api from "@/lib/api";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'ENROLLMENT' | 'PAYMENT' | 'Q_AND_A' | 'ANNOUNCEMENT' | 'COURSE_STATUS';
  referenceUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (page = 0, size = 10): Promise<NotificationResponse[]> => {
    const res = await api.get<any>("/api/notifications", {
      params: { page, size, sort: 'createdAt,desc' }
    }) as any;
    // Interceptor returns result, which is a Page object
    return res?.content || res || [];
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<any>("/api/notifications/unread-count") as any;
    return typeof res === 'number' ? res : (res?.result ?? 0);
  },

  markAsRead: async (id: string) => {
    await api.patch(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch("/api/notifications/read-all");
  }
};
