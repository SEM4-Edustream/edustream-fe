"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, Star, Loader2, ShoppingCart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wishlistService, WishlistItemResponse } from '@/services/wishlistService';
import { cartService } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/my-learning/wishlist');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlistItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (courseId: string) => {
    try {
      setRemovingId(courseId);
      await wishlistService.removeFromWishlist(courseId);
      setItems(prev => prev.filter(item => item.courseId !== courseId));
      toast.success('Removed from wishlist');
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (courseId: string) => {
    try {
      setAddingToCartId(courseId);
      await cartService.addToCart(courseId);
      toast.success('Added to cart!');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
    } finally {
      setAddingToCartId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-12 mt-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
            <HeartOff className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-6">Explore courses and save your favorites!</p>
            <Link href="/courses">
              <Button className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold px-8 h-12 rounded-none">
                Explore Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group flex flex-col space-y-2 cursor-pointer"
              >
                {/* Thumbnail */}
                <Link href={`/courses/${item.courseId}`}>
                  <div className="relative aspect-video bg-slate-100 border border-slate-200 overflow-hidden">
                    <img 
                      src={item.courseThumbnail || '/images/course-placeholder.jpg'} 
                      alt={item.courseTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button 
                      onClick={(e) => { e.preventDefault(); handleRemove(item.courseId); }}
                      disabled={removingId === item.courseId}
                      className="absolute top-2 right-2 w-8 h-8 bg-white shadow-md flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      {removingId === item.courseId ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      ) : (
                        <Heart className="w-4 h-4 text-pink-500 fill-current" />
                      )}
                    </button>
                  </div>
                </Link>

                <div className="space-y-1">
                  <Link href={`/courses/${item.courseId}`}>
                    <h3 className="font-bold text-[#1c1d1f] text-[15px] leading-[1.2] line-clamp-2 min-h-[36px] hover:text-indigo-600 transition-colors">
                      {item.courseTitle}
                    </h3>
                  </Link>
                  <p className="text-[12px] text-slate-500 font-medium">{item.tutorName || 'Instructor'}</p>

                  {item.courseRating && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-amber-700">{item.courseRating.toFixed(1)}</span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span className="text-[12px] text-slate-400 font-medium">({item.courseReviewCount || 0})</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-[16px] text-[#1c1d1f]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.coursePrice || 0)}
                    </span>
                  </div>

                  <Button 
                    onClick={() => handleAddToCart(item.courseId)}
                    disabled={addingToCartId === item.courseId}
                    className="w-full h-10 bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold rounded-none transition-all active:scale-95 text-xs"
                  >
                    {addingToCartId === item.courseId ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
