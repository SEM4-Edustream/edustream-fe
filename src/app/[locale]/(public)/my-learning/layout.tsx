'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function MyLearningLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isWishlist = pathname === '/my-learning/wishlist';

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 max-w-md"
        >
          <div className="relative mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
             <Trophy className="w-12 h-12 text-slate-300" />
          </div>
          <div className="space-y-3">
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Login to see your progress</h2>
             <p className="text-slate-500">Track your learning journey and access all your enrolled courses in one place.</p>
          </div>
          <Link href="/login?redirect=/my-learning" className="block">
             <Button className="w-full bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 rounded-none">
                Sign In
             </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header - Udemy Dark Style */}
      <div className="bg-[#1c1d1f] text-white pt-10 pb-2 px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-8">
           <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">My learning</h1>
           
           <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
              <Link 
                href="/my-learning"
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-[4px] relative ${
                  !isWishlist 
                  ? 'border-white text-white' 
                  : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                All courses
              </Link>
              <Link 
                href="/my-learning/wishlist"
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-[4px] relative ${
                  isWishlist 
                  ? 'border-white text-white' 
                  : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Wishlist
              </Link>
           </div>
        </div>
      </div>

      <main>
        {children}
      </main>
    </div>
  );
}
