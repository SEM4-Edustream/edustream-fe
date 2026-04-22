import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { CourseCard } from '@/components/ui/course-card';

export default async function CourseList() {
  const courses = await courseService.getPublishedCourses({ size: 6 });
  const items = courses.content ?? [];

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 lg:px-12 pt-4 pb-16 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2 text-wrap-balance">Most Popular Courses</h2>
          <p className="text-muted-foreground text-base max-w-xl">
            Explore our top-rated courses and start your learning journey today.
          </p>
        </div>
        <Link href="/courses">
          <Button variant="ghost" className="text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50">
            View all courses →
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((course) => (
            <CourseCard key={course.id} href={`/courses/${course.id}`}>
              <CourseCard.Thumbnail 
                src={course.thumbnailUrl || ''} 
                alt={course.title}
                isBestSeller={(course.averageRating ?? 0) > 4.5} 
              />
              
              <CourseCard.Content>
                <CourseCard.Title>{course.title}</CourseCard.Title>
                <CourseCard.Description>{course.description || 'Explore this course on EduStream.'}</CourseCard.Description>
                
                <CourseCard.Footer>
                  <CourseCard.Author name={course.tutorName || 'EduStream Tutor'} />
                  <CourseCard.Rating value={course.averageRating ?? null} count={course.reviewCount ?? 0} />
                  <CourseCard.Price value={course.price ?? null} />
                </CourseCard.Footer>
              </CourseCard.Content>
            </CourseCard>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Play className="h-10 w-10 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses available yet</h3>
            <p className="text-gray-500">Check back later for new premium content!</p>
          </div>
        )}
      </div>
    </section>
  );
}
