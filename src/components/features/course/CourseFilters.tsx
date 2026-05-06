'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CategoryResponse } from '@/services/courseService';
import { cn } from '@/lib/utils';

interface CourseFiltersProps {
  categories: CategoryResponse[];
  className?: string;
}

export function CourseFilters({ categories, className }: CourseFiltersProps) {
  const t = useTranslations('CourseListing.Filters');
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';
  const selectedLevel = searchParams.get('level') || '';
  const selectedPrice = searchParams.get('price') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set('page', '0'); // Reset to first page on filter change
    router.push(`/courses?${params.toString()}`);
  };

  const levels = [
    { label: t('levels.beginner'), value: 'BEGINNER' },
    { label: t('levels.intermediate'), value: 'INTERMEDIATE' },
    { label: t('levels.expert'), value: 'EXPERT' },
    { label: t('levels.all'), value: 'ALL_LEVELS' },
  ];

  const prices = [
    { label: t('prices.free'), value: 'FREE' },
    { label: t('prices.paid'), value: 'PAID' },
  ];

  return (
    <div className={cn("space-y-8", className)}>
      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('categories')}</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox 
                id={`cat-${category.id}`} 
                checked={selectedCategory === category.slug}
                onCheckedChange={() => updateFilters('category', category.slug)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label 
                htmlFor={`cat-${category.id}`} 
                className="text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('level')}</h4>
        <div className="space-y-3">
          {levels.map((level) => (
            <div key={level.value} className="flex items-center space-x-3">
              <Checkbox 
                id={`level-${level.value}`} 
                checked={selectedLevel === level.value}
                onCheckedChange={() => updateFilters('level', level.value)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label 
                htmlFor={`level-${level.value}`} 
                className="text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {level.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('price')}</h4>
        <div className="space-y-3">
          {prices.map((price) => (
            <div key={price.value} className="flex items-center space-x-3">
              <Checkbox 
                id={`price-${price.value}`} 
                checked={selectedPrice === price.value}
                onCheckedChange={() => updateFilters('price', price.value)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label 
                htmlFor={`price-${price.value}`} 
                className="text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {price.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || selectedLevel || selectedPrice) && (
        <button 
          onClick={() => router.push('/courses')}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
        >
          {t('clear')}
        </button>
      )}
    </div>
  );
}
