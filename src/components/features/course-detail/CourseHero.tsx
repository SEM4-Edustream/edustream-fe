import React from 'react';
import { Star, Users, Clock, PlayCircle, Share2, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/course';

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="bg-slate-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-indigo-500 hover:bg-indigo-600 border-none capitalize">
                {course.category}
              </Badge>
              {course.level && (
                <Badge variant="outline" className="text-white border-white/30 capitalize">
                   {course.level.toLowerCase()}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight">
              {course.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <span className="font-bold text-white">4.8</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 underline">(2,543 ratings)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4" />
                <span>12.5k students enrolled</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                 <span className="text-slate-500">Created by</span>
                 <span className="text-indigo-400 font-bold underline cursor-pointer hover:text-indigo-300 transition-colors">
                    {course.tutorName || "Expert Instructor"}
                 </span>
              </div>
              <span>Last updated April 2026</span>
              <div className="flex items-center gap-1">
                 <Clock className="w-4 h-4" />
                 <span>24.5 total hours</span>
              </div>
            </div>
          </div>

          {/* Right Column (For mobile layout spacing, but main content will be in CheckoutCard) */}
          <div className="hidden lg:block">
            {/* Visual spacer for sticky card alignment */}
          </div>

        </div>
      </div>
    </section>
  );
}
