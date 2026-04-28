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

export const paymentService = {
  createBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await api.post<any>('/api/student/bookings', data);
    return unwrapResult(response) as unknown as BookingResponse;
  },

  createPaymentLink: async (bookingId: string): Promise<PaymentLinkResponse> => {
    const response = await api.post<any>(`/api/student/payments/create-link/${bookingId}`);
    return unwrapResult(response) as unknown as PaymentLinkResponse;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await api.delete(`/api/student/bookings/${bookingId}`);
  },
};
