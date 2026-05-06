'use client';

import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { CourseSummary, courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Heart, Check, Loader2 } from 'lucide-react';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CourseQuickViewProps {
  course: CourseSummary;
  children: React.ReactNode; 
}

export function CourseQuickView({ course, children }: CourseQuickViewProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Check status on open
  const onOpenChange = async (open: boolean) => {
    if (open && isAuthenticated) {
      try {
        const [cartItems, wishlistItems, enrolled] = await Promise.all([
          cartService.getCartItems(),
          wishlistService.getWishlistItems(),
          courseService.checkEnrollment(course.id)
        ]);
        setIsInCart(cartItems.some(item => item.courseId === course.id));
        setIsInWishlist(wishlistItems.some(item => item.courseId === course.id));
        setIsEnrolled(enrolled);
      } catch { /* ignore */ }
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      toast.error(error?.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const totalHours = Math.floor(Math.random() * 40) + 10;
  const mockObjectives = course.learningObjectives?.length 
    ? course.learningObjectives.slice(0, 3) 
    : [
        "You will learn to build a Web Application, REST API and Full Stack Application",
        "You will Master Fundamentals of Spring Framework from Zero, no previous experience required",
        "You will Learn Spring Framework the MODERN WAY - The way Real Projects use it!"
      ];

  return (
    <HoverCard openDelay={300} closeDelay={100} onOpenChange={onOpenChange}>
      <HoverCardTrigger asChild>
        <div className="h-full w-full block cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:ring-0">
          {children}
        </div>
      </HoverCardTrigger>

      <HoverCardContent 
        side="right" 
        align="start" 
        sideOffset={14} 
        className="w-[340px] p-6 shadow-2xl border border-gray-200 bg-white z-[100] rounded-none animate-in zoom-in-95 data-[side=left]:slide-in-from-right-4 data-[side=right]:slide-in-from-left-4"
        avoidCollisions={true}
      >
        <h3 className="font-bold text-[18px] text-[#1c1d1f] mb-2 leading-tight">
          {course.title}
        </h3>
        
        <div className="text-[12px] font-bold text-[#1e6055] mb-3">
          Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        
        <div className="text-[12px] text-[#6a6f73] mb-3">
          {totalHours} total hours • All Levels • Subtitles
        </div>
        
        <p className="text-[14px] text-[#1c1d1f] mb-4 line-clamp-3">
          {course.subtitle || "No subtitle available for this course yet."}
        </p>
        
        <ul className="space-y-3 mb-6">
          {mockObjectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-[#1c1d1f]">
              <Check className="w-5 h-5 text-[#1c1d1f] shrink-0 font-light" strokeWidth={1.5} />
              <span className="leading-tight mt-0.5">{obj}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mt-auto">
          {isEnrolled ? (
            <Button 
              onClick={() => router.push(`/learning/${course.id}`)}
              className="flex-1 bg-[#1c1d1f] hover:bg-slate-800 text-white h-12 text-[16px] font-bold rounded-xl"
            >
              Go to Course
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`flex-1 ${isInCart ? 'bg-white border-2 border-[#1c1d1f] text-[#1c1d1f] hover:bg-slate-50' : 'bg-[#a435f0] hover:bg-[#8710d8] text-white'} h-12 text-[16px] font-bold rounded-xl transition-all`}
              >
                {addingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isInCart ? (
                  'Go to cart'
                ) : (
                  'Add to cart'
                )}
              </Button>
              <Button 
                onClick={handleToggleWishlist}
                disabled={togglingWishlist}
                variant="outline" 
                size="icon" 
                className={`h-12 w-12 rounded-full border-[#1c1d1f] border hover:bg-slate-50 shrink-0 transition-all ${isInWishlist ? 'bg-pink-50 border-pink-500 text-pink-600' : ''}`}
              >
                {togglingWishlist ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} strokeWidth={2} />
                )}
              </Button>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}