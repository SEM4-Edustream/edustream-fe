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

export const cartService = {
  getCartItems: async (): Promise<CartItemResponse[]> => {
    const response = await api.get<any>('/api/cart');
    return (unwrapResult(response) as any) ?? [];
  },

  addToCart: async (courseId: string): Promise<CartItemResponse> => {
    const response = await api.post<any>(`/api/cart/${courseId}`);
    return unwrapResult(response) as any;
  },

  removeFromCart: async (courseId: string): Promise<void> => {
    await api.delete(`/api/cart/${courseId}`);
  },

  getCartCount: async (): Promise<number> => {
    const response = await api.get<any>('/api/cart/count');
    return (unwrapResult(response) as any) ?? 0;
  },

  checkoutCart: async (): Promise<any> => {
    const response = await api.post<any>('/api/student/bookings/checkout-cart');
    return unwrapResult(response) as any;
  },
};
