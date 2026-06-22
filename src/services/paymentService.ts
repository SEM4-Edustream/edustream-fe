import api from '@/lib/api';

export interface BookingRequest {
  courseId: string;
}

export interface BookingItemResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  price: number;
}

export interface BookingResponse {
  id: string;
  items: BookingItemResponse[];
  status: string;
  amount: number;
  createdAt: string;
}

export interface PaymentLinkResponse {
  checkoutUrl: string;
  qrCode: string;
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  isPaid?: boolean;
}

export interface PageMeta<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export const paymentService = {
  createBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    return await api.post<any>('/api/student/bookings', data) as any;
  },

  createPaymentLink: async (bookingId: string): Promise<PaymentLinkResponse> => {
    return await api.post<any>(`/api/student/payments/create-link/${bookingId}`) as any;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await api.delete(`/api/student/bookings/${bookingId}`);
  },

  getMyBookings: async (page: number = 0, size: number = 10): Promise<PageMeta<BookingResponse>> => {
    return await api.get<any>(`/api/student/bookings/my-bookings`, { params: { page, size } }) as any;
  }
};
