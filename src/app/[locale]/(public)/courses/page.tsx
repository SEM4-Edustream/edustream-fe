'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  courseService, 
  CourseSummary, 
  CategoryResponse,
  searchCourses 
} from '@/services/courseService';
import { CourseGrid } from '@/components/features/course/CourseGrid';
import { CourseFilters } from '@/components/features/course/CourseFilters';
import { CourseSort } from '@/components/features/course/CourseSort';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

function CoursePageContent() {
  const t = useTranslations('CourseListing');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);

  // Fetch categories once
  useEffect(() => {
    courseService.getCategories().then(setCategories);
  }, []);

  // Fetch categories once
  useEffect(() => {
    courseService.getCategories().then(setCategories);
  }, []);

  // Fetch courses whenever searchParams change
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const result = await searchCourses({
          keyword: searchParams.get('keyword') || '',
          category: searchParams.get('category') || '',
          page: searchParams.get('page') || '0',
          sort: searchParams.get('sort') || 'newest',
        });
        
        setCourses(result.content);
        setTotalPages(result.totalPages);
        setCurrentPage(result.number);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/courses?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('keyword', searchQuery);
    } else {
      params.delete('keyword');
    }
    params.set('page', '0');
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-16 relative overflow-hidden">
        {/* Abstract shapes for premium look */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full blur-3xl -ml-24 -mb-24 opacity-60"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="flex mb-4 text-sm font-medium text-slate-500 gap-2">
              <Link href="/" className="hover:text-indigo-600 cursor-pointer">{t('home')}</Link>
              <span>/</span>
              <span className="text-slate-900">{t('courses')}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {t('title_start')} <span className="text-indigo-600">{t('title_highlight')}</span> {t('title_end')}
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder={t('search_placeholder')} 
                  className="pl-12 h-14 bg-white border-slate-200 rounded-2xl text-base shadow-sm focus:ring-indigo-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-base font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                {t('search_btn')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">{t('filters')}</h3>
              </div>
              <CourseFilters categories={categories} />
            </div>
          </aside>

          {/* Main List Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="text-slate-600 font-medium">
                {t('showing')} <span className="text-slate-900 font-bold">{courses.length}</span> {t('results')}
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="lg:hidden flex-1 h-10 rounded-xl gap-2 border-slate-200"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {t('filters')}
                </Button>
                <CourseSort />
              </div>
            </div>

            {/* Grid */}
            <CourseGrid courses={courses} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-slate-200"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    className={cn(
                      "w-10 h-10 rounded-full font-bold",
                      currentPage === i ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-200 text-slate-600"
                    )}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-slate-200"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">{t('filters')}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <CourseFilters categories={categories} />
            <Button className="w-full mt-8 h-12 bg-indigo-600" onClick={() => setShowMobileFilters(false)}>
              {t('show_results')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <CoursePageContent />
    </Suspense>
  );
}
