"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MonitorPlay, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary } from '@/services/courseService';
import CourseEditorSidebar from '@/components/features/tutor-dashboard/CourseEditorSidebar';

export default function CourseEditorLayout({ children }: { children: React.ReactNode }) {
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  const [course, setCourse] = useState<CourseSummary | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course', error);
      }
    };
    fetchCourse();
  }, [courseId]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
      <header className="h-18 border-b border-slate-200 bg-slate-900 text-white flex items-center px-4 justify-between sticky top-0 z-50 h-16">
        <div className="flex items-center gap-4">
          <Link href="/tutor/dashboard" className="p-2 hover:bg-slate-800 rounded transition-colors" title="Back to courses">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold truncate max-w-[200px] lg:max-w-md">{course?.title || 'Loading...'}</h2>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                  {course?.status || 'Draft'}
               </span>
               <span className="text-[10px] text-slate-400 font-medium italic">
                  0min of video content uploaded
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-white font-bold hover:bg-slate-800 hidden lg:flex gap-2">
             <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button variant="ghost" className="text-white h-10 w-10 p-0 hover:bg-slate-800">
             <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        <CourseEditorSidebar 
          courseId={courseId} 
          completionStatus={{
            goals: (course?.learningObjectives?.length || 0) > 0,
            curriculum: (course?.modules?.length || 0) > 0,
            basics: !!course?.thumbnailUrl,
            pricing: (course?.price || 0) > 0
          }}
        />
        <main className="flex-1 bg-white overflow-y-auto max-h-[calc(100vh-64px)]">
           {children}
        </main>
      </div>
    </div>
  );
}
