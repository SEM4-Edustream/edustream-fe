"use client";

import React, { useState, useEffect } from 'react';
import { PlayCircle, ShieldCheck, Monitor, Smartphone, Award, Infinity, RefreshCcw, Heart, Lock, FileText, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseSummary, courseService } from '@/services/courseService';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CourseCheckoutCardProps {
  course: CourseSummary;
}

export default function CourseCheckoutCard({ course }: CourseCheckoutCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        const enrolled = await courseService.checkEnrollment(course.id);
        setIsEnrolled(enrolled);

        // Check if course is in cart
        try {
          const cartItems = await cartService.getCartItems();
          setIsInCart(cartItems.some(item => item.courseId === course.id));
        } catch { /* ignore if not logged in */ }

        // Check if course is in wishlist
        try {
          const wishlistItems = await wishlistService.getWishlistItems();
          setIsInWishlist(wishlistItems.some(item => item.courseId === course.id));
        } catch { /* ignore */ }
      }
      setIsLoading(false);
    };
    checkStatus();
  }, [isAuthenticated, course.id]);

  // --- Dynamic Calculation Logic ---
  const allLessons = course.modules?.flatMap(m => m.lessons || []) || [];
  
  const totalVideoSeconds = allLessons
    .filter(l => l.type === 'VIDEO')
    .reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
  
  const totalHours = (totalVideoSeconds / 3600).toFixed(1);
  const totalArticles = allLessons.filter(l => l.type === 'TEXT').length;
  const totalQuizzes = allLessons.filter(l => l.type === 'QUIZ').length;
  // Placeholder for resources until schema is updated
  const totalResources = Math.floor(allLessons.length / 3); 

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to enroll in this course');
      router.push(`/login?redirect=/courses/${course.id}`);
      return;
    }
    
    if (isEnrolled) {
      router.push(`/learning/${course.id}`);
      return;
    }
    
    router.push(`/checkout/${course.id}`);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to add to cart');
      router.push(`/login?redirect=/courses/${course.id}`);
      return;
    }

    if (isInCart) {
      router.push('/cart');
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart(course.id);
      setIsInCart(true);
      toast.success('Added to cart!');
      // Dispatch event to update navbar badge
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save to wishlist');
      router.push(`/login?redirect=/courses/${course.id}`);
      return;
    }

    try {
      setTogglingWishlist(true);
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(course.id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(course.id);
        setIsInWishlist(true);
        toast.success('Added to wishlist!');
      }
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update wishlist';
      toast.error(msg);
    } finally {
      setTogglingWishlist(false);
    }
  };

  return (
    <div className="bg-white border-none lg:shadow-[0_2px_24px_rgba(0,0,0,0.08)] rounded-none lg:rounded-2xl overflow-hidden lg:sticky lg:top-8 z-20 transition-all duration-300 hover:shadow-[0_12px_45px_rgba(0,0,0,0.12)]">
      
      {/* Video Preview / Image Thumbnail */}
      <div className="relative aspect-video bg-black flex items-center justify-center group cursor-pointer overflow-hidden">
        <img 
          src={course.thumbnailUrl || "/images/course-placeholder.jpg"} 
          alt={course.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        <div className="relative z-10 flex flex-col items-center gap-3">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-500">
             <PlayCircle className="w-10 h-10 text-slate-900 fill-current" />
           </div>
           <span className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500 drop-shadow-lg">
             Preview Course
           </span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 line-through font-bold text-sm">
               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((course.price || 0) * 1.5)}
            </span>
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded">
               33% off
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleBuyNow}
            disabled={isLoading}
            className={`w-full h-14 text-base font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200`}
          >
            {isLoading ? 'Checking status...' : isEnrolled ? (
              <>Go to Course <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : (
              'Buy now'
            )}
          </Button>
          {!isEnrolled && (
            <div className="flex gap-2">
              <Button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                variant="outline" 
                className={`flex-1 h-12 text-sm font-bold border-2 rounded-xl transition-all ${
                  isInCart
                    ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                    : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {addingToCart ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isInCart ? (
                  <><Check className="w-4 h-4 mr-2" /> Go to cart</>
                ) : (
                  <><ShoppingCart className="w-4 h-4 mr-2" /> Add to cart</>
                )}
              </Button>
              <Button 
                onClick={handleToggleWishlist}
                disabled={togglingWishlist}
                variant="outline" 
                className={`w-12 h-12 p-0 border-2 rounded-xl transition-all group ${
                  isInWishlist 
                    ? 'border-pink-500 bg-pink-50 text-pink-600' 
                    : 'border-indigo-600 text-indigo-600 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'group-hover:fill-current'}`} />
              </Button>
            </div>
          )}
        </div>

        <div className="text-center">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] leading-none border-b-2 border-slate-100 pb-1">
              30-Day Money-Back Guarantee
           </span>
        </div>

        {/* Course Features List */}
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-indigo-600" />
             This course includes:
          </h4>
          <ul className="space-y-3 text-[13px] text-slate-700 font-medium">
             {totalHours !== "0.0" && (
                <FeatureItem icon={<Monitor className="w-4 h-4" />} text={`${totalHours} hours on-demand video`} />
             )}
             {totalArticles > 0 && (
                <FeatureItem icon={<FileText className="w-4 h-4" />} text={`${totalArticles} articles`} />
             )}
             {totalQuizzes > 0 && (
                <FeatureItem icon={<RefreshCcw className="w-4 h-4" />} text={`${totalQuizzes} quizzes`} />
             )}
             <FeatureItem icon={<Infinity className="w-4 h-4" />} text="Full lifetime access" />
             <FeatureItem icon={<Smartphone className="w-4 h-4" />} text="Access on mobile and TV" />
             <FeatureItem icon={<Award className="w-4 h-4" />} text="Certificate of completion" />
          </ul>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
           <button className="text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-colors border-b-2 border-transparent hover:border-indigo-600">
              Share
           </button>
           <button className="text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-colors border-b-2 border-transparent hover:border-indigo-600">
              Gift Course
           </button>
           <button className="text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-colors border-b-2 border-transparent hover:border-indigo-600">
              Apply Coupon
           </button>
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-4 group cursor-default">
       <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</span>
       <span className="group-hover:translate-x-1 transition-transform duration-300">{text}</span>
    </li>
  );
}
