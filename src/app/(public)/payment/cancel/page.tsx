"use client";

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentService } from '@/services/paymentService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const handleCancel = async () => {
      const courseId = searchParams.get('courseId');
      const bookingId = searchParams.get('bookingId');

      if (!courseId || !bookingId) {
        toast.error("Invalid cancellation data.");
        router.push('/');
        return;
      }

      try {
        await paymentService.cancelBooking(bookingId);
        toast.info("Payment cancelled. Booking removed.");
      } catch (error) {
        console.error("Failed to cancel booking:", error);
      } finally {
        router.push(`/checkout/${courseId}`);
      }
    };

    handleCancel();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
      <h1 className="text-xl font-bold text-slate-900 mb-2">Cancelling Payment</h1>
      <p className="text-slate-500">Please wait while we clear your pending transaction...</p>
    </div>
  );
}
