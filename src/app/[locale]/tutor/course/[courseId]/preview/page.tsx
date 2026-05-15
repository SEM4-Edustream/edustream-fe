"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService, CourseSummary } from '@/services/courseService';
import CourseHero from '@/components/features/course-detail/CourseHero';
import CourseContent from '@/components/features/course-detail/CourseContent';
import CourseCheckoutCard from '@/components/features/course-detail/CourseCheckoutCard';
import { Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function CoursePreviewPage() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        // Dùng getCourseDetail (API của Tutor) để lấy đầy đủ dữ liệu dù chưa Published
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
      } catch (err: any) {
        console.error('Preview fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load course preview');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Generating premium preview...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Preview Unavailable</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error || "We couldn't find the course you're looking for."}</p>
        <Button onClick={() => window.close()} variant="outline" className="font-bold">
          Close Preview
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* PREVIEW BAR */}
      <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between sticky top-0 z-[60] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Preview Mode</div>
          <p className="text-xs font-medium opacity-90 hidden sm:block">Đây là bản xem trước của trang chi tiết khóa học khi được công khai.</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10 font-bold text-xs gap-2"
          onClick={() => window.close()}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Editor
        </Button>
      </div>

      {/* Hero Section */}
      <CourseHero course={course} />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 py-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-20">
            
            <CourseContent course={course} />
            
            {/* Requirements */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Requirements</h2>
                <ul className="grid grid-cols-1 gap-3 list-none">
                   {course.prerequisites.map((req, i) => (
                     <li key={i} className="flex gap-4 items-start text-slate-700 font-normal leading-relaxed">
                        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 shrink-0" />
                        {req}
                     </li>
                   ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Description</h2>
               <div 
                 className="prose prose-slate max-w-none text-slate-700 font-normal leading-loose"
                 dangerouslySetInnerHTML={{ __html: course.description || 'No description available for this course yet.' }}
               />
            </div>

            {/* Target Audience */}
            {course.targetAudiences && course.targetAudiences.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Who is this course for?</h2>
                <ul className="grid grid-cols-1 gap-3 list-none">
                   {course.targetAudiences.map((aud, i) => (
                     <li key={i} className="flex gap-4 items-start text-slate-700 font-normal">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2.5 shrink-0" />
                        {aud}
                     </li>
                   ))}
                </ul>
              </div>
            )}
            
            {/* Tutor Bio */}
            <div className="space-y-10 pt-10 border-t border-slate-100 pb-20">
               <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Instructor</h2>
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0">
                         <img 
                           src={course.tutorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.tutorName}`} 
                           alt={course.tutorName} 
                           className="w-full h-full object-cover" 
                         />
                      </div>
                      <div className="space-y-1">
                          <h3 className="text-xl font-bold text-indigo-600">{course.tutorName}</h3>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Senior Educator • EduStream Expert</p>
                      </div>
                  </div>
                  <p className="text-slate-600 leading-loose font-normal max-w-3xl italic bg-slate-50 p-6 rounded-2xl border-l-4 border-indigo-600">
                     Experienced professional dedicated to student success. With over a decade in the field, {course.tutorName} focus on delivering practical, industry-relevant knowledge through high-quality structured curriculum.
                  </p>
               </div>
            </div>
          </div>

          {/* Sidebar Area: Checkout Card */}
          <div className="relative">
            <div className="lg:-mt-64">
              <CourseCheckoutCard course={course} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
