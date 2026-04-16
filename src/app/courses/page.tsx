import React, { Suspense } from 'react';
import { BookOpen, SlidersHorizontal, Loader2 } from 'lucide-react';
import { searchCourses } from '@/services/courseService';
import { CourseFilters } from '@/components/features/course-catalog/CourseFilters';
import { CourseCard } from '@/components/ui/course-card';
import Link from 'next/link';

// Next.js passes searchParams to page components automatically
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  // Extract typed parameters safely
  const keywordOpt = typeof params.keyword === 'string' ? params.keyword : undefined;
  const sortOpt = typeof params.sort === 'string' ? params.sort : undefined;
  const pageOpt = typeof params.page === 'string' ? params.page : '0';

  // Fetch purely Server-side using Backend Database Pagination
  const coursePage = await searchCourses({
    keyword: keywordOpt,
    sort: sortOpt,
    page: pageOpt,
    size: '12'
  });

  const courses = coursePage?.content || [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Client-side Sidebar (URL driven) */}
        <CourseFilters />

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Danh sách Khóa học</h1>
              {keywordOpt && (
                <p className="text-sm text-slate-500 mt-1">Kết quả cho "{keywordOpt}"</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              {/* Note: In a real app we would make this a client component that pushes to URL as well */}
              <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
                Hiển thị mới nhất
              </div>
            </div>
          </div>

          {!coursePage ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
              <p className="text-destructive font-semibold">Lỗi kết nối máy chủ dữ liệu.</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto border-2 border-slate-100 rounded-full p-4 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900">Không tìm thấy khóa học</h3>
              <p className="text-slate-500 mt-2">Thử điều chỉnh lại bộ lọc tìm kiếm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} href={`/courses/${course.id}`}>
                  <CourseCard.Thumbnail 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    isBestSeller={course.averageRating !== null && course.averageRating >= 4.5} 
                  />
                  
                  <CourseCard.Content>
                    <CourseCard.Title>{course.title}</CourseCard.Title>
                    <CourseCard.Footer>
                      <CourseCard.Author name={course.tutorName} />
                      <CourseCard.Rating value={course.averageRating} count={course.reviewCount} />
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold tracking-tight text-indigo-700">
                           {course.price && course.price > 0 
                             ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price) 
                             : "Miễn phí"
                           }
                        </span>
                        <span className="text-sm font-bold text-blue-600 group-hover:underline">Chi tiết</span>
                      </div>
                    </CourseCard.Footer>
                  </CourseCard.Content>
                </CourseCard>
              ))}
            </div>
          )}
          
          {/* Pagination Component Placeholder */}
          {coursePage && coursePage.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
               <span className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold cursor-pointer">
                  Trang {coursePage.pageNo + 1} / {coursePage.totalPages}
               </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
