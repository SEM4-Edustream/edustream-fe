'use client';

import React from 'react';
import { CourseSummary } from '@/services/courseService';
import { CourseCard } from '@/components/ui/course-card';
import { CourseCardSkeleton } from './CourseCardSkeleton';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseGridProps {
  courses: CourseSummary[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
}

export function CourseGrid({ courses, isLoading, viewMode = 'grid' }: CourseGridProps) {
  if (isLoading) {
    return (
      <div className={cn(
        "gap-6",
        viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
      )}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-500 max-w-xs">
          We couldn't find any courses matching your current filters. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "animate-in fade-in duration-500",
      viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"
    )}>
      {courses.map((course) => {
        const shortSummary = course.subtitle || course.description || '';

        return (
          <CourseCard
            key={course.id}
            href={`/courses/${course.id}`}
            className={viewMode === 'list' ? 'flex-col sm:flex-row h-auto border-b border-[#d1d7dc] pb-6 !border-t-0 !border-l-0 !border-r-0 rounded-none' : ''}
          >
            <div className={viewMode === 'list' ? 'w-full sm:w-[260px] lg:w-[260px] shrink-0 border border-gray-200' : ''}>
              <CourseCard.Thumbnail 
                src={course.thumbnailUrl || ''} 
                alt={course.title} 
              />
            </div>
            
            <div className={cn(
              "flex flex-col flex-1 min-w-0 mt-4 sm:mt-0 lg:pl-4",
              viewMode === 'list' && "relative pr-24" // Để chỗ cho Price bên phải
            )}>
              <CourseCard.Content className={viewMode === 'list' ? '!p-0' : ''}>
                
                <h3 className={cn(
                  "font-bold text-[#1c1d1f] mb-1 line-clamp-2",
                  viewMode === 'list' ? "text-[16px] leading-[1.3] text-black pr-2" : "text-[16px] leading-[1.2]"
                )}>
                  {course.title}
                </h3>

                {shortSummary && (
                  <p className={cn(
                    "text-[13px] text-gray-600 mb-1",
                    viewMode === 'list' ? "line-clamp-2 hidden lg:block pr-6" : "line-clamp-2"
                  )}>
                    {shortSummary}
                  </p>
                )}
                  
                <CourseCard.Author name={course.tutorName || 'EduStream Instructor'} />
                  
                <CourseCard.Rating value={course.averageRating || 0} count={course.reviewCount || 0} />
                  
                {viewMode === 'list' && (
                  <div className="text-[12px] text-[#6a6f73] mt-0.5 flex items-center flex-wrap gap-1">
                    <span>{Math.floor(Math.random() * 40) + 10} total hours</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{Math.floor(Math.random() * 150) + 30} lectures</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">
                      {course.level === 'BEGINNER' ? 'Beginner' :
                       course.level === 'INTERMEDIATE' ? 'Intermediate' :
                       course.level === 'EXPERT' ? 'Expert' : 'All Levels'}
                    </span>
                  </div>
                )}

                {/* Thêm Bestseller Bagde */}
                <div className="mt-1.5 flex gap-1">
                   <CourseCard.Badges isBestSeller={(course.averageRating || 0) > 4.5} />
                </div>

                {viewMode === 'list' ? (
                  <div className="absolute right-0 top-0 text-right mt-1 lg:mt-0">
                    <CourseCard.Price value={course.price || 0} />
                  </div>
                ) : (
                  <CourseCard.Footer>
                    <CourseCard.Price value={course.price || 0} />
                  </CourseCard.Footer>
                )}
                
              </CourseCard.Content>
            </div>
          </CourseCard>
        );
      })}
    </div>
  );
}
