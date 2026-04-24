import React, { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import PartnerLogos from '@/components/home/PartnerLogos';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import CourseList from '@/components/home/CourseList';
import Testimonials from '@/components/home/Testimonials';
import TutorBanner from '@/components/home/TutorBanner';
import FAQ from '@/components/home/FAQ';
import AuthRouterWrapper from '@/components/home/AuthRouterWrapper';

function CourseListSkeleton() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 lg:px-12 pt-4 pb-16 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">Most Popular Courses</h2>
          <p className="text-muted-foreground text-base max-w-xl">
            Explore our top-rated courses and start your learning journey today.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className="w-full h-[360px] bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <AuthRouterWrapper>
      <main className="flex-1 w-full flex flex-col items-center bg-white">
        <HeroSection />
        <PartnerLogos />
        
        <CategoryShowcase />

        <Suspense fallback={<CourseListSkeleton />}>
          <CourseList />
        </Suspense>

        <Testimonials />
        <TutorBanner />
        <FAQ />
      </main>
    </AuthRouterWrapper>
  );
}
