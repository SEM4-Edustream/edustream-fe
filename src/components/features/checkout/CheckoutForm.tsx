"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseSummary } from '@/services/courseService';
import { paymentService } from '@/services/paymentService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { QrCode, Lock } from 'lucide-react';

interface CheckoutFormProps {
  course: CourseSummary;
}

export default function CheckoutForm({ course }: CheckoutFormProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const price = course.price || 0;
  // Giả lập discount
  const originalPrice = price * 1.5;
  const discount = originalPrice - price;

  const handlePay = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to proceed with payment');
      router.push(`/login?redirect=/checkout/${course.id}`);
      return;
    }
    
    try {
      setIsProcessing(true);
      const booking = await paymentService.createBooking({ courseId: course.id });
      const paymentLink = await paymentService.createPaymentLink(booking.id);
      
      if (paymentLink.checkoutUrl) {
        window.location.href = paymentLink.checkoutUrl;
      } else {
        toast.error('Failed to get payment link. Please try again later.');
      }
    } catch (error: any) {
      console.error('Payment flow error:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Checkout Details */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          
          {/* Payment Method */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Payment method</h2>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                Secure and encrypted <Lock className="w-3 h-3" />
              </span>
            </div>
            
            <div className="border border-indigo-600 rounded-lg p-4 bg-indigo-50/30 ring-1 ring-indigo-600/20">
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  checked 
                  readOnly 
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-600"
                />
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900">PAYOS (QR Code / Chuyển khoản)</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 ml-7">
                You will be redirected to PayOS gateway to securely scan a QR code and complete your transfer.
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Order details (1 course)</h2>
            <div className="flex gap-4 items-start p-4 border border-slate-200 rounded-lg bg-white">
              <img 
                src={course.thumbnailUrl || "/images/course-placeholder.jpg"} 
                alt={course.title} 
                className="w-32 aspect-video object-cover rounded shadow-sm"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-slate-900 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-500">By {course.tutorName}</p>
              </div>
              <div className="text-right space-y-1">
                <div className="font-bold text-indigo-600">{formatCurrency(price)}</div>
                <div className="text-xs text-slate-400 line-through">{formatCurrency(originalPrice)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-slate-50 rounded-xl p-6 lg:p-8 sticky top-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Summary</h2>
            
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Original Price:</span>
                <span>{formatCurrency(originalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discounts:</span>
                <span className="text-emerald-600">-{formatCurrency(discount)}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-slate-900 text-lg">
              <span>Total:</span>
              <span>{formatCurrency(price)}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed text-center">
              By completing your purchase, you agree to these <a href="#" className="text-indigo-600 hover:underline">Terms of Use</a>.
            </p>

            <Button 
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(price)}`}
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs font-bold text-slate-900">30-Day Money-Back Guarantee</p>
              <p className="text-[11px] text-slate-500 mt-1">Not satisfied? Get a full refund within 30 days. Simple and straightforward!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
