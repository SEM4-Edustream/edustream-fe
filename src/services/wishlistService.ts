import api from '@/lib/api';

export interface WishlistItemResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSubtitle?: string;
  courseThumbnail?: string;
  tutorName?: string;
  coursePrice?: number;
  courseRating?: number;
  courseReviewCount?: number;
}


export const wishlistService = {
  getWishlistItems: async (): Promise<WishlistItemResponse[]> => {
    const response = await api.get<any>('/api/wishlist') as any;
    return response ?? [];
  },

  addToWishlist: async (courseId: string): Promise<WishlistItemResponse> => {
    return await api.post<any>(`/api/wishlist/${courseId}`) as any;
  },

  removeFromWishlist: async (courseId: string): Promise<void> => {
    await api.delete(`/api/wishlist/${courseId}`);
  },

  getWishlistCount: async (): Promise<number> => {
    const response = await api.get<any>('/api/wishlist/count') as any;
    return response ?? 0;
  },
};
