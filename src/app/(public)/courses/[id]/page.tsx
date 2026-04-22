import React from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/services/courseService';
import CourseHero from '@/components/features/course-detail/CourseHero';
import CourseContent from '@/components/features/course-detail/CourseContent';
import CourseCheckoutCard from '@/components/features/course-detail/CourseCheckoutCard';
import { Metadata } from 'next';
import { PlayCircle, Star } from 'lucide-react';

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
      {/* Hero Section - Full Width Solid Background */}
      <CourseHero course={course} />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 py-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* 1. What you'll learn & Curriculum */}
            <CourseContent course={course} />
            
            {/* 2. Requirements */}
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

            {/* 3. Description */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
               <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Description</h2>
               <div className="prose prose-slate max-w-none text-slate-700 font-normal leading-loose whitespace-pre-wrap">
                  {course.description}
               </div>
            </div>

            {/* 4. Target Audience */}
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
            
            {/* 5. Tutor Bio Section */}
            <div className="space-y-10 pt-10 border-t border-slate-100 pb-20">
               <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Instructor</h2>
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0">
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.tutorName}`} 
                          alt={course.tutorName} 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-bold text-indigo-600 hover:underline cursor-pointer transition-all">{course.tutorName}</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Senior Educator • EduStream Expert</p>
                        <div className="flex items-center gap-4 pt-2">
                           <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                              <PlayCircle className="w-4 h-4 text-slate-500" />
                              <span>12 Courses</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                              <Star className="w-4 h-4 text-amber-500 fill-current" />
                              <span>4.8 Instructor Rating</span>
                           </div>
                        </div>
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
