'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { courseService, CourseSummary } from '@/services/courseService';
import { CourseCard } from '@/components/ui/course-card';
import { CourseQuickView } from '@/components/ui/course-quick-view';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function CourseCarousel({ title, subtitle, courses }: { title: string, subtitle?: string, courses: CourseSummary[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-[24px] font-bold text-[#1c1d1f] mb-1">{title}</h2>
      {subtitle && <p className="text-[16px] font-bold text-[#1c1d1f] mb-4">{subtitle}</p>}
      
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar pb-6 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => (
            <div key={course.id} className="w-[85vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-10.66px)] lg:w-[calc(20%-12.8px)] shrink-0 snap-start relative">
              <CourseQuickView course={course}>
                <CourseCard href={`/courses/${course.id}`}>
                  <CourseCard.Thumbnail 
                    src={course.thumbnailUrl || ''} 
                    alt={course.title}
                  />
                  <CourseCard.Content>
                    <CourseCard.Title>{course.title}</CourseCard.Title>
                    <CourseCard.Author name={course.tutorName || 'EduStream Tutor'} />
                    <CourseCard.Rating value={course.averageRating ?? null} count={course.reviewCount ?? 0} />
                    <CourseCard.Footer>
                      <CourseCard.Price value={course.price ?? null} />
                      <CourseCard.Badges isBestSeller={(course.averageRating ?? 0) > 4.5} />
                    </CourseCard.Footer>
                  </CourseCard.Content>
                </CourseCard>
              </CourseQuickView>
            </div>
          ))}
        </div>
        
        {courses.length > 0 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-[25%] -translate-y-1/2 -left-5 h-12 w-12 rounded-full bg-white hover:bg-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200 hidden md:group-hover:flex z-10 text-[#1c1d1f]"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-[25%] -translate-y-1/2 -right-5 h-12 w-12 rounded-full bg-white hover:bg-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200 hidden md:group-hover:flex z-10 text-[#1c1d1f]"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    courseService.getPublishedCourses({ size: 30 }).then(res => {
      const allCourses = res.content || [];
      const publishedCourses = allCourses.filter(
        (course) => course.status === 'PUBLISHED'
      );
      setCourses(publishedCourses);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-white pb-20 pt-8 mt-16 md:mt-24 lg:mt-0">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 md:px-12 mt-8">
        
        {/* Header Profile */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-full bg-[#1c1d1f] text-white flex items-center justify-center text-xl font-bold overflow-hidden shadow-sm">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName || user.username || 'User Avatar'} className="w-full h-full object-cover" />
            ) : (
              (user?.fullName || user?.username || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1c1d1f]">Welcome back, {user?.fullName || user?.username}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[15px] font-normal text-[#1c1d1f]">Manager, Sales & Business Development</span>
              <span className="text-[#6a6f73]"></span>
              <Link href="/profile" className="text-[15px] font-bold text-[#5624d0] underline hover:text-[#401b9c] transition-colors">
                Edit occupation and interests
              </Link>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="relative w-full h-[320px] sm:h-[400px] bg-[#1c1d1f] mb-16 flex items-center shadow-sm">
          {/* Background pattern matching Udemy closely */}
          <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
             {/* Art simulation */}
             <div className="absolute w-[1200px] h-[1200px] border-[80px] border-[#f8fafc] rounded-full -top-[600px] -right-[150px] rotate-45 opacity-90"></div>
             <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-purple-500 to-orange-500 rounded-full -top-[50px] right-[50px] blur-sm opacity-90"></div>
             <div className="absolute w-8 h-[200%] bg-white/40 rotate-45 right-[45%] -top-[50%] z-0 blur-sm opacity-70"></div>
          </div>
          
          {/* White Box inside Banner */}
          <div className="relative z-10 bg-white p-8 ml-0 md:ml-12 max-w-[420px] shadow-lg w-full sm:w-auto h-auto">
            <h2 className="text-[32px] sm:text-[36px] font-bold text-[#1c1d1f] mb-3 leading-[1.2]">Special offer — just hours to save!</h2>
            <p className="text-[#1c1d1f] text-[16px] leading-relaxed">
              Your exclusive longtime-learner deal: courses from just ₫239,000 for a very limited time.
            </p>
          </div>
        </div>

        {/* Carousels */}
        {isLoading ? (
          <div className="space-y-8 animate-pulse mb-12">
            <div className="h-8 bg-gray-200 w-64 rounded"></div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-[300px] h-[340px] bg-gray-100 rounded-xl shrink-0"></div>)}
            </div>
          </div>
        ) : (
          <>
            <CourseCarousel 
              title="What to learn next" 
              subtitle="Recommended for you" 
              courses={courses.slice(0, 6)} 
            />
            
            <CourseCarousel 
              title="Trending courses" 
              courses={courses.slice(1, 8).reverse()} 
            />
          </>
        )}

      </div>
    </main>
  );
}