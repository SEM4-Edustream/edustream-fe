'use client';

import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { CourseSummary } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Heart, Check } from 'lucide-react';

interface CourseQuickViewProps {
  course: CourseSummary;
  children: React.ReactNode; 
}

export function CourseQuickView({ course, children }: CourseQuickViewProps) {
  // Dữ liệu giả lập cho hiển thị giống Udemy vì Backend chưa có (Hours, Bullets)
  const totalHours = Math.floor(Math.random() * 40) + 10;
  const mockObjectives = course.learningObjectives?.length 
    ? course.learningObjectives.slice(0, 3) 
    : [
        "You will learn to build a Web Application, REST API and Full Stack Application",
        "You will Master Fundamentals of Spring Framework from Zero, no previous experience required",
        "You will Learn Spring Framework the MODERN WAY - The way Real Projects use it!"
      ];

  return (
    <HoverCard openDelay={300} closeDelay={100}>
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
        avoidCollisions={true} // Tự động lật trái phải nếu đụng mép màn hình
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
          <Button className="flex-1 bg-[#a435f0] hover:bg-[#8710d8] text-white h-12 text-[16px] font-bold rounded-none">
            Add to cart
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-[#1c1d1f] border hover:bg-slate-50 shrink-0">
            <Heart className="w-5 h-5 text-[#1c1d1f]" strokeWidth={2} />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}