"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function TutorBanner() {
  const { user, isAuthenticated } = useAuth();
    
  // Dynamic redirection logic
  const getTutorHref = () => {
    if (!isAuthenticated) return '/register';
    if (user?.role === 'TUTOR') return '/tutor/dashboard';
    return '/tutor/onboarding'; // Students apply to be tutors here
  };

  const tutorHref = getTutorHref();

  return (
    <section className="w-full bg-[#f8f9fa] py-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight leading-tight">
              Become an instructor
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Instructors from around the world teach millions of learners on EduStream. 
              We provide the tools and platform to share your knowledge and teach what you love.
            </p>
            <div className="pt-4">
              <Link href={tutorHref}>
                <Button size="lg" className="h-14 px-8 text-base font-bold bg-[#1c1d1f] hover:bg-slate-800 text-white rounded-lg transition-all">
                  Start teaching today
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="lg:w-1/2 relative">
             <div className="relative aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
               <Image 
                 src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                 alt="Tutor teaching"
                 fill
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full -z-10 blur-3xl opacity-60" />
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-100 rounded-full -z-10 blur-3xl opacity-60" />
          </div>

        </div>
      </div>
    </section>
  );
}
