"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Settings, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary } from '@/services/courseService';
import CourseEditorSidebar from '@/components/features/tutor-dashboard/CourseEditorSidebar';
import { useAuth } from "@/context/AuthContext";

export default function CourseEditorLayout({ children }: { children: React.ReactNode }) {
  const { courseId } = useParams() as { courseId: string };
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push(`/login?redirect=/tutor/course/${courseId}/manage`);
    }
  }, [isAuthLoading, isAuthenticated, router, courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) fetchCourse();

    const handleCourseUpdate = () => {
      if (courseId) {
         // Re-fetch quietly in background
         courseService.getCourseDetail(courseId).then(setCourse).catch(console.error);
      }
    };

    window.addEventListener('course-updated', handleCourseUpdate);
    return () => window.removeEventListener('course-updated', handleCourseUpdate);
  }, [courseId]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
           <p className="text-slate-500 font-bold">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Full-screen Top Header (No Dashboard Navbar) */}
      <header className="h-16 border-b border-slate-200 bg-[#1c1d1f] text-white flex items-center px-4 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/tutor/dashboard" className="p-2 hover:bg-slate-800 rounded transition-colors" title="Back to dashboard">
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
          <Button variant="ghost" className="text-white font-bold hover:bg-slate-800 hidden lg:flex gap-2 h-10 px-4 rounded-none border border-white/20 hover:border-white">
             <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button variant="ghost" className="text-white h-10 w-10 p-0 hover:bg-slate-800 rounded-none border border-transparent hover:border-white/20">
             <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Container without Dashboard Sidebar */}
      <div className="flex flex-1">
        <CourseEditorSidebar 
          courseId={courseId} 
          status={course?.status}
          completionStatus={{
            goals: (course?.learningObjectives?.length || 0) > 0,
            curriculum: (course?.modules?.length || 0) > 0,
            basics: !!course?.thumbnailUrl,
            pricing: (course?.price || 0) > 0
          }}
        />
        <main className="flex-1 bg-white overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-hide">
           {children}
        </main>
      </div>
    </div>
  );
}
