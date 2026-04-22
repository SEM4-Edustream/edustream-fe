import React from 'react';
import { Star, Users, Clock, PlayCircle, Share2, Heart, AlertCircle, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CourseSummary } from '@/services/courseService';
import Link from 'next/link';

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="bg-[#1c1d1f] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-sm">
               <span className="text-indigo-400 font-bold hover:underline cursor-pointer">
                  {course.category?.name || "Academic"}
               </span>
               <span className="text-slate-500 font-bold">&gt;</span>
               <span className="text-slate-400 font-medium">Course Details</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.2] text-white">
              {course.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              {course.subtitle || course.description?.substring(0, 160) + "..."}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-400 text-lg">4.8</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Link href="#reviews" className="text-indigo-400 underline text-sm font-bold">
                   (2,543 ratings)
                </Link>
                <span className="text-slate-400 text-sm font-medium">12,543 students</span>
              </div>
            </div>

            <div className="space-y-3 text-sm font-bold">
              <div className="flex items-center gap-2">
                 <span className="text-slate-400">Created by</span>
                 <Link href={`/tutor/${course.tutorProfileId}`} className="text-indigo-400 underline decoration-indigo-400/30 hover:decoration-indigo-400 transition-all">
                    {course.tutorName}
                 </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-300">
                 <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    <span>Last updated April 2026</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>{course.language || "English"}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-slate-600 font-black text-slate-300 h-5">
                       {course.level || "ALL LEVELS"}
                    </Badge>
                 </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            {/* Visual spacer for sticky card alignment */}
          </div>

        </div>
      </div>
    </section>
  );
}
