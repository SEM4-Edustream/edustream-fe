import React, { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CourseList from '@/components/home/CourseList';

function CourseListSkeleton() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Most Popular Courses</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            These are the most popular courses among EduStream learners. Start learning today and unlock your potential.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <HeroSection />
      
      <Suspense fallback={<CourseListSkeleton />}>
        <CourseList />
      </Suspense>
    </main>
  );
}
