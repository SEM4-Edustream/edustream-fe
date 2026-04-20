import React from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/services/courseService';
import CourseHero from '@/components/features/course-detail/CourseHero';
import CourseContent from '@/components/features/course-detail/CourseContent';
import CourseCheckoutCard from '@/components/features/course-detail/CourseCheckoutCard';
import { Metadata } from 'next';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

// Dynamic Metadata for SEO
export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) return { title: 'Course Not Found - EduStream' };
  
  return {
    title: `${course.title} | EduStream`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Full Width Dark Background */}
      <CourseHero course={course} />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-16">
            <CourseContent course={course} />
            
            {/* Instructor Bio Section (Simplified for now) */}
            <div className="space-y-6 pt-12 border-t border-slate-100">
               <h2 className="text-2xl font-bold font-serif tracking-tight">Instructor</h2>
               <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold text-indigo-600 underline cursor-pointer">{course.tutorName}</h3>
                     <p className="text-sm text-slate-500 font-bold uppercase tracking-wider italic">Expert Educator</p>
                     <p className="text-slate-600 leading-relaxed font-medium">
                        Professional instructor with years of expertise in the industry. Dedicated to helping students achieve their goals through high-quality video content and practical assignments.
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Area: Checkout Card */}
          <div className="relative -mt-32 md:-mt-64 lg:-mt-96">
            <CourseCheckoutCard course={course} />
          </div>

        </div>
      </div>
    </main>
  );
}
