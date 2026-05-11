import api from "@/lib/api";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'ENROLLMENT' | 'PAYMENT' | 'Q_AND_A' | 'ANNOUNCEMENT';
  referenceUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (page = 0, size = 10) => {
    const res = await api.get<any>("/api/notifications", {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return res.result?.content || res.content || [];
  },

  getUnreadCount: async () => {
    const res = await api.get<any>("/api/notifications/unread-count");
    return res.result ?? res ?? 0;
  },

  markAsRead: async (id: string) => {
    await api.patch(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch("/api/notifications/read-all");
  }
};
