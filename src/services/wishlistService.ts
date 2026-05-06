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

export const wishlistService = {
  getWishlistItems: async (): Promise<WishlistItemResponse[]> => {
    const response = await api.get<any>('/api/wishlist');
    return (unwrapResult(response) as any) ?? [];
  },

  addToWishlist: async (courseId: string): Promise<WishlistItemResponse> => {
    const response = await api.post<any>(`/api/wishlist/${courseId}`);
    return unwrapResult(response) as any;
  },

  removeFromWishlist: async (courseId: string): Promise<void> => {
    await api.delete(`/api/wishlist/${courseId}`);
  },

  getWishlistCount: async (): Promise<number> => {
    const response = await api.get<any>('/api/wishlist/count');
    return (unwrapResult(response) as any) ?? 0;
  },
};
