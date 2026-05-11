import api from '@/lib/api';

export interface CartItemResponse {
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


export const cartService = {
  getCartItems: async (): Promise<CartItemResponse[]> => {
    const response = await api.get<any>('/api/cart') as any;
    return response ?? [];
  },

  addToCart: async (courseId: string): Promise<CartItemResponse> => {
    return await api.post<any>(`/api/cart/${courseId}`) as any;
  },

  removeFromCart: async (courseId: string): Promise<void> => {
    await api.delete(`/api/cart/${courseId}`);
  },

  getCartCount: async (): Promise<number> => {
    const response = await api.get<any>('/api/cart/count') as any;
    return response ?? 0;
  },

  checkoutCart: async (): Promise<any> => {
    return await api.post<any>('/api/student/bookings/checkout-cart') as any;
  },
};
