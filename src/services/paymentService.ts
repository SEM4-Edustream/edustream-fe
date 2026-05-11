import api from '@/lib/api';

export interface BookingRequest {
  courseId: string;
}

export interface BookingResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
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
};
