"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ArrowRight, Star, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cartService, CartItemResponse } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCartItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (courseId: string) => {
    try {
      setRemovingId(courseId);
      await cartService.removeFromCart(courseId);
      setItems(prev => prev.filter(item => item.courseId !== courseId));
      toast.success('Removed from cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      const booking = await cartService.checkoutCart();
      window.dispatchEvent(new Event('cart-updated'));
      
      if (booking.status === 'PAID') {
        // All free courses — auto enrolled
        toast.success('Successfully enrolled! All courses were free.');
        router.push('/my-learning');
      } else {
        // Redirect to payment
        router.push(`/checkout/${booking.id}?type=booking`);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Checkout failed';
      toast.error(msg);
    } finally {
      setCheckingOut(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.coursePrice || 0), 0);
  const originalPrice = totalPrice * 1.5;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Shopping Cart</h1>
        <p className="text-slate-500 font-medium mb-8">
          {items.length} {items.length === 1 ? 'course' : 'courses'} in cart
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Keep shopping to find a course!</p>
            <Link href="/courses">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 h-12 rounded-xl">
                Explore Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex gap-4 group hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <Link href={`/courses/${item.courseId}`} className="shrink-0">
                    <div className="w-32 h-20 md:w-44 md:h-28 rounded-lg overflow-hidden bg-slate-100">
                      <img 
                        src={item.courseThumbnail || '/images/course-placeholder.jpg'} 
                        alt={item.courseTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/courses/${item.courseId}`}>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-2 hover:text-indigo-600 transition-colors">
                        {item.courseTitle}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      By {item.tutorName || 'Instructor'}
                    </p>
                    {item.courseRating && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-sm font-bold text-amber-700">{item.courseRating.toFixed(1)}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        <span className="text-xs text-slate-400">
                          ({item.courseReviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <span className="font-bold text-lg text-indigo-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.coursePrice || 0)}
                    </span>
                    <button 
                      onClick={() => handleRemove(item.courseId)}
                      disabled={removingId === item.courseId}
                      className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors mt-2"
                    >
                      {removingId === item.courseId ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Total:</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </p>
                  <p className="text-sm text-slate-400 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
                  </p>
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded">
                    33% off
                  </p>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  {checkingOut ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <>Checkout <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>

                <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-wider">
                  30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
