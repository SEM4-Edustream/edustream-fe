'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { 
  courseService, 
  CourseSummary, 
  CategoryResponse,
  searchCourses 
} from '@/services/courseService';
import { CourseGrid } from '@/components/features/course/CourseGrid';
import { CourseFilters } from '@/components/features/course/CourseFilters';
import { CourseSort } from '@/components/features/course/CourseSort';
import { Search, SlidersHorizontal, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function CoursePageContent() {
  const t = useTranslations('CourseListing');
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const routeCategorySlug = params.slug as string;

  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const matchedCategory = categories.find(c => c.slug === routeCategorySlug);
  const currentCategoryName = matchedCategory ? matchedCategory.name : (routeCategorySlug.charAt(0).toUpperCase() + routeCategorySlug.slice(1));

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
          page: searchParams.get('page') || '0',
          sort: searchParams.get('sort') || 'newest',
        });
        
        let filteredContent = result.content;

        // Client-side filtering for Level and Price if API doesn't support them yet
        const level = searchParams.get('level');
        const price = searchParams.get('price');
        const searchCategoryParam = searchParams.get('category');
        const currentCategorySlug = searchCategoryParam || routeCategorySlug;

        if (currentCategorySlug) {
          filteredContent = filteredContent.filter(c => c.category?.slug === currentCategorySlug);
        }
        if (level) {
          filteredContent = filteredContent.filter(c => c.level === level);
        }
        if (price) {
          if (price === 'FREE') filteredContent = filteredContent.filter(c => !c.price || c.price === 0);
          if (price === 'PAID') filteredContent = filteredContent.filter(c => c.price && c.price > 0);
        }

        setCourses(filteredContent);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams, routeCategorySlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      currentParams.set('keyword', searchQuery);
    } else {
      currentParams.delete('keyword');
    }
    currentParams.set('page', '0');
    router.push(`/courses/category/${routeCategorySlug}?${currentParams.toString()}`);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Header Section - Minimal Udemy Style */}
      <div className="container mx-auto px-4 pt-12 pb-6 mt-16 md:mt-24 lg:mt-0">
        <h1 className="text-[32px] font-bold text-[#1c1d1f] mb-6">
          {t('category_title', { category: currentCategoryName })}
        </h1>

        {/* Info Banner */}
        <div className="flex items-center gap-4 p-4 border border-[#d1d7dc] rounded-lg mb-8 max-w-[800px] bg-white">
          <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-[#1c1d1f]">
            <Info className="w-5 h-5 text-[#5624d0]" strokeWidth={2} />
          </div>
          <span className="text-[16px] font-bold text-[#1c1d1f]">
            {t('guarantee')}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-24">
              <CourseFilters categories={categories} />
            </div>
          </aside>

          {/* Main List Area */}
          <main className="flex-1 max-w-[900px]">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="h-12 px-4 rounded-none border-[#1c1d1f] text-[#1c1d1f] font-bold hover:bg-slate-50 gap-2 bg-white"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {t('filter')}
                </Button>
                <CourseSort />
              </div>
              <div className="text-[16px] font-bold text-[#6a6f73]">
                {courses.length.toLocaleString()} {t('results')}
              </div>
            </div>

            {/* Grid/List */}
            <CourseGrid courses={courses} isLoading={isLoading} viewMode="list" />
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">{t('filter')}</h3>
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
