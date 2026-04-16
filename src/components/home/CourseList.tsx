import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { getPublicCourses } from '@/services/courseService';
import { CourseCard } from '@/components/ui/course-card';

// Mover to features architecture
export default async function CourseList() {
  // Service Fetching - No direct client tools like local-storage axios
  const courses = await getPublicCourses(6);

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Most Popular Courses</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            These are the most popular courses among EduStream learners. Start learning today and unlock your potential.
          </p>
        </div>
        <Link href="/courses">
          <Button variant="ghost" className="text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50">
            View all courses &rarr;
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course) => (
            // Clean, Descriptive Compound Pattern
            <CourseCard key={course.id} href={`/courses/${course.id}`}>
              <CourseCard.Thumbnail 
                src={course.thumbnailUrl} 
                alt={course.title}
                isBestSeller={course.averageRating !== null && course.averageRating > 4.5} 
              />
              
              <CourseCard.Content>
                <CourseCard.Title>{course.title}</CourseCard.Title>
                <CourseCard.Description>{course.description}</CourseCard.Description>
                
                <CourseCard.Footer>
                  <CourseCard.Author name={course.tutorName} />
                  <CourseCard.Rating value={course.averageRating} count={course.reviewCount} />
                  <CourseCard.Price value={course.price} />
                </CourseCard.Footer>
              </CourseCard.Content>
            </CourseCard>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Play className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses available yet</h3>
            <p className="text-gray-500">Check back later for new premium content!</p>
          </div>
        )}
      </div>
    </section>
  );
}
